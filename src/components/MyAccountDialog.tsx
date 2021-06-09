import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import Toast from "./Toast";
import { showDialog } from "./Dialog";
import userService from "../helpers/userService";
import "../less/my-account-dialog.less";

interface Props extends DialogProps {}

/**
 * 我的账号
 */
const MyAccountDialog: React.FunctionComponent<Props> = (props) => {
  const [user, setUser] = useState(userService.getState().user);
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [showEditInputs, setShowEditInputs] = useState(false);

  useEffect(() => {
    const unsubscribeUserServie = userService.subscribe(({ user }) => {
      setUser(user);
      setUsername(user?.username ?? "");
    });

    return () => {
      unsubscribeUserServie();
    };
  }, []);

  const handleCloseBtnClick = () => {
    props.destroy();
  };

  const handleUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextUsername = e.target.value as string;
    setUsername(nextUsername);
  };

  const handleConfirmEditBtnClick = async () => {
    if (username === user?.username) {
      setShowEditInputs(false);
      return;
    }

    const { data } = await api.checkUsernameUsable(username);

    if (data) {
      await api.updateUserinfo(username);
      await userService.doSignIn();
      setShowEditInputs(false);
      Toast.info("修改成功~");
    } else {
      Toast.error("用户名无法使用");
    }
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
          <label className="form-label input-form-label">
            <span className="normal-text">ID：</span>
            <input type="text" disabled value={user?.id} />
          </label>
          <label className="form-label input-form-label">
            <span className="normal-text">创建时间：</span>
            <input type="text" disabled value={utils.getDateString(user?.createdAt!)} />
          </label>
          <label className="form-label password-label">
            <span className="normal-text">密码：</span>
            <span className="text-btn" onClick={showChangePasswordDialog}>
              修改密码
            </span>
          </label>
          <hr />
          <label className="form-label input-form-label">
            <span className="normal-text">账号：</span>
            <input type="text" disabled={!showEditInputs} value={username} onChange={handleUsernameChanged} />
          </label>
        </div>
        <div className="btns-container">
          <span
            className={"text-btn " + (showEditInputs ? "hidden" : "")}
            onClick={() => {
              setShowEditInputs(true);
            }}
          >
            修改一下
          </span>
          <span
            className={"text-btn cancel-btn " + (showEditInputs ? "" : "hidden")}
            onClick={() => {
              setUsername(user?.username ?? "");
              setShowEditInputs(false);
            }}
          >
            撤销
          </span>
          <span className={"text-btn confirm-btn " + (showEditInputs ? "" : "hidden")} onClick={handleConfirmEditBtnClick}>
            保存
          </span>
        </div>
      </div>
    </>
  );
};

const ChangePasswordDialog: React.FunctionComponent<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  useEffect(() => {
    // do nth
  }, []);

  const handleCloseBtnClick = () => {
    props.destroy();
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
      Toast.error("密码不能为空");
      return;
    }

    if (newPassword !== newPasswordAgain) {
      Toast.error("新密码两次输入不一致");
      setNewPasswordAgain("");
      return;
    }

    const { data } = await api.checkPasswordValid(oldPassword);

    if (!data) {
      Toast.error("旧密码不匹配");
      setOldPassword("");
      return;
    }

    await api.updateUserinfo("", newPassword);
    Toast.info("密码修改成功！");
    handleCloseBtnClick();
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
        <label className="form-label input-form-label">
          <span className="normal-text">旧密码：</span>
          <input type="password" value={oldPassword} onChange={handleOldPasswordChanged} />
        </label>
        <label className="form-label input-form-label">
          <span className="normal-text">新密码：</span>
          <input type="password" value={newPassword} onChange={handleNewPasswordChanged} />
        </label>
        <label className="form-label input-form-label">
          <span className="normal-text">再次输入新密码：</span>
          <input type="password" value={newPasswordAgain} onChange={handleNewPasswordAgainChanged} />
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

export default function showMyAccountDialog() {
  showDialog(
    {
      className: "my-account-dialog",
    },
    MyAccountDialog,
    {}
  );
}
