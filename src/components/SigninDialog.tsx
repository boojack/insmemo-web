import React, { useState } from "react";
import { api } from "../helpers/api";
import { userService } from "../helpers/userService";
import { toast } from "./Toast";
import "../less/dialog.less";
import "../less/signin-dialog.less";

interface Props {
  close: FunctionType;
}

export function SigninDialog(props: Props) {
  const { close } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const handlePasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const handleSigninBtnClick = async (action: "signin" | "signup") => {
    try {
      const actionFunc = action === "signin" ? api.signin : api.signup;
      const { succeed, message } = await actionFunc(username, password);

      if (!succeed && message) {
        toast.error(message);
        return;
      }

      await userService.doSignIn();
      if (userService.checkIsSignIn()) {
        close();
      } else {
        toast.error("不知道发生了什么错误😟");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="dialog-wrapper">
      <div className="dialog-container signin-dialog">
        <div className="dialog-header-container">
          <p className="title-text">👋 账号注册/登录</p>
          <button className="text-btn close-btn" onClick={close}>
            ❌
          </button>
        </div>
        <div className="dialog-content-container">
          <input type="text" value={username} onChange={handleUsernameChanged} />
          <input type="password" value={password} onChange={handlePasswordChanged} />
        </div>
        <div className="dialog-footer-container">
          <button className="text-btn signup-btn" onClick={() => handleSigninBtnClick("signup")}>
            注册
          </button>
          <button className="text-btn signin-btn" onClick={() => handleSigninBtnClick("signin")}>
            登录
          </button>
        </div>
      </div>
    </div>
  );
}
