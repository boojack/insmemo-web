import React, { useEffect, useState } from "react";
import { userStore } from "../stores";
import { userService } from "../services";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import useSelector from "../hooks/useSelector";
import toast from "./Toast";
import { showDialog } from "./Dialog";
import "../less/my-account-dialog.less";

interface Props extends DialogProps {}

const MyAccountDialog: React.FC<Props> = ({ destroy }) => {
  const { user } = useSelector(userStore);
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [showEditUsernameInputs, setShowEditUsernameInputs] = useState(false);
  const [showConfirmUnbindBtn, setShowConfirmUnbindBtn] = useState(false);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextUsername = e.target.value as string;
    setUsername(nextUsername);
  };

  const handleConfirmEditUsernameBtnClick = async () => {
    if (user?.username === "guest") {
      toast.info("🈲 不要修改我的用户名");
      return;
    }

    if (username === user?.username) {
      setShowEditUsernameInputs(false);
      return;
    }

    try {
      const data = await checkUsernameUsable(username);

      if (!data) {
        toast.error("用户名无法使用");
        return;
      }

      await updateUsername(username);
      await userService.doSignIn();
      setShowEditUsernameInputs(false);
      toast.info("修改成功~");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleChangePasswordBtnClick = () => {
    if (user?.username === "guest") {
      toast.info("🈲 不要修改我的密码");
      return;
    }

    showChangePasswordDialog();
  };

  const handleUnbindGithubBtnClick = async () => {
    if (showConfirmUnbindBtn) {
      await removeGithubName();
      await userService.doSignIn();
      setShowConfirmUnbindBtn(false);
    } else {
      setShowConfirmUnbindBtn(true);
    }
  };

  const handlePreventDefault = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🤠</span>我的账号
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <div className="section-container account-section-container">
          <p className="title-text">基本信息</p>
          <label className="form-label input-form-label">
            <span className="normal-text">ID：</span>
            <span className="normal-text">{user?.id}</span>
          </label>
          <label className="form-label input-form-label">
            <span className="normal-text">创建时间：</span>
            <span className="normal-text">{utils.getDateString(user?.createdAt!)}</span>
          </label>
          <label className="form-label input-form-label username-label">
            <span className="normal-text">账号：</span>
            <input
              type="text"
              readOnly={!showEditUsernameInputs}
              value={username}
              onClick={() => {
                setShowEditUsernameInputs(true);
              }}
              onChange={handleUsernameChanged}
            />
            <div className="btns-container" onClick={handlePreventDefault}>
              <span
                className={"text-btn confirm-btn " + (showEditUsernameInputs ? "" : "hidden")}
                onClick={handleConfirmEditUsernameBtnClick}
              >
                保存
              </span>
              <span
                className={"text-btn cancel-btn " + (showEditUsernameInputs ? "" : "hidden")}
                onClick={() => {
                  setUsername(user?.username ?? "");
                  setShowEditUsernameInputs(false);
                }}
              >
                撤销
              </span>
            </div>
          </label>
          <label className="form-label password-label">
            <span className="normal-text">密码：</span>
            <span className="text-btn" onClick={handleChangePasswordBtnClick}>
              修改密码
            </span>
          </label>
        </div>
        <div className="section-container account-section-container">
          <p className="title-text">关联账号</p>
          <label className="form-label input-form-label">
            <span className="normal-text">GitHub：</span>
            {user?.githubName ? (
              <>
                <a className="value-text" href={"https://github.com/" + user?.githubName}>
                  {user?.githubName}
                </a>
                <span className="btn-text" onMouseLeave={() => setShowConfirmUnbindBtn(false)} onClick={handleUnbindGithubBtnClick}>
                  {showConfirmUnbindBtn ? "确定取消绑定！" : "取消绑定"}
                </span>
              </>
            ) : (
              <>
                <span className="value-text">无</span>
                <a
                  className="link-text"
                  href="https://github.com/login/oauth/authorize?client_id=187ba36888f152b06612&scope=read:user,gist"
                >
                  前往绑定
                </a>
              </>
            )}
          </label>
        </div>
      </div>
    </>
  );
};

const ChangePasswordDialog: React.FC<Props> = ({ destroy }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  useEffect(() => {
    // do nth
  }, []);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleOldPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setOldPassword(text);
  };

  const handleNewPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setNewPassword(text);
  };

  const handleNewPasswordAgainChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setNewPasswordAgain(text);
  };

  const handleSaveBtnClick = async () => {
    if (oldPassword === "" || newPassword === "" || newPasswordAgain === "") {
      toast.error("密码不能为空");
      return;
    }

    if (newPassword !== newPasswordAgain) {
      toast.error("新密码两次输入不一致");
      setNewPasswordAgain("");
      return;
    }

    try {
      const data = await checkPasswordValid(oldPassword);

      if (!data) {
        toast.error("旧密码不匹配");
        setOldPassword("");
        return;
      }

      await updatePassword(newPassword);
      toast.info("密码修改成功！");
      handleCloseBtnClick();
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">修改密码</p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <p className="tip-text">如果是 GitHub 登录，则初始密码为用户名</p>
        <label className="form-label input-form-label">
          <input type="password" value={oldPassword} onChange={handleOldPasswordChanged} />
          <span className={"normal-text " + (oldPassword === "" ? "" : "not-null")}>旧密码</span>
        </label>
        <label className="form-label input-form-label">
          <input type="password" value={newPassword} onChange={handleNewPasswordChanged} />
          <span className={"normal-text " + (newPassword === "" ? "" : "not-null")}>新密码</span>
        </label>
        <label className="form-label input-form-label">
          <input type="password" value={newPasswordAgain} onChange={handleNewPasswordAgainChanged} />
          <span className={"normal-text " + (newPasswordAgain === "" ? "" : "not-null")}>再次输入新密码</span>
        </label>
        <div className="btns-container">
          <span className="text-btn cancel-btn" onClick={handleCloseBtnClick}>
            取消
          </span>
          <span className="text-btn confirm-btn" onClick={handleSaveBtnClick}>
            保存
          </span>
        </div>
      </div>
    </>
  );
};

function showChangePasswordDialog() {
  showDialog(
    {
      className: "change-password-dialog",
    },
    ChangePasswordDialog,
    {}
  );
}

function checkUsernameUsable(username: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    api
      .checkUsernameUsable(username)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject("请求失败");
      });
  });
}

function updateUsername(username: string): Promise<void> {
  return new Promise((resolve, reject) => {
    api
      .updateUserinfo(username)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("请求失败");
      });
  });
}

function removeGithubName(): Promise<void> {
  return new Promise((resolve, reject) => {
    api
      .removeGithubName()
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("请求失败");
      });
  });
}

function checkPasswordValid(password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    api
      .checkPasswordValid(password)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject("请求失败");
      });
  });
}

function updatePassword(password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    api
      .updateUserinfo("", password)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("请求失败");
      });
  });
}

export default function showMyAccountDialog() {
  showDialog(
    {
      className: "my-account-dialog",
    },
    MyAccountDialog,
    {}
  );
}
