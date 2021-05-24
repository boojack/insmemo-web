import React, { useState } from "react";
import { api } from "../helpers/api";
import { userService } from "../helpers/userService";
import { toast } from "./Toast";
import { showDialog } from "./Dialog";
import "../less/dialog.less";
import "../less/signin-dialog.less";

interface Props {
  destory: FunctionType;
}

const SigninDialog: React.FunctionComponent<Props> = (props) => {
  const { destory } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const handlePasswordInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const handleActionBtnClick = async (action: "signin" | "signup") => {
    try {
      const actionFunc = action === "signin" ? api.signin : api.signup;
      const { succeed, message } = await actionFunc(username, password);

      if (!succeed && message) {
        toast.error("😟 " + message);
        return;
      }

      await userService.doSignIn();
      if (userService.checkIsSignIn()) {
        destory();
      } else {
        toast.error("😟 不知道发生了什么错误");
      }
    } catch (error) {
      console.log(error);
      toast.error("😟 " + error.message);
    }
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">👋 账号注册 / 登录</p>
        {/* <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
            ✖️
          </button> */}
      </div>
      <div className="dialog-content-container">
        <input type="text" value={username} placeholder="用户名" onChange={handleUsernameInputChanged} />
        <input type="password" value={password} placeholder="密码" onChange={handlePasswordInputChanged} />
      </div>
      <div className="dialog-footer-container">
        <button className="text-btn signup-btn" onClick={() => handleActionBtnClick("signup")}>
          注册
        </button>
        <span className="split-text">/</span>
        <button className="text-btn signin-btn" onClick={() => handleActionBtnClick("signin")}>
          登录
        </button>
      </div>
    </>
  );
};

export function showSigninDialog() {
  showDialog(
    {
      className: "signin-dialog",
    },
    SigninDialog,
    {}
  );
}
