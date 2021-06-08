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
          <hr />
          <label className="form-label input-form-label">
            <span className="normal-text">用户名：</span>
            <input type="text" disabled={!showEditInputs} value={username} onChange={handleUsernameChanged} />
          </label>
          <p className="tip-text">...to be continue</p>
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

export default function showMyAccountDialog() {
  showDialog(
    {
      className: "my-account-dialog",
    },
    MyAccountDialog,
    {}
  );
}
