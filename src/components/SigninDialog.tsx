import React, { useState } from "react";
import ReactDOM from "react-dom";
import { api } from "../helpers/api";
import { userService } from "../helpers/userService";
import { toast } from "./Toast";
import "../less/dialog.less";
import "../less/signin-dialog.less";

interface Props {
  destory: FunctionType;
}

export function SigninDialog(props: Props) {
  const { destory } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCloseBtnClick = () => {
    toast.info("请先登录/注册");
  };

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
        destory();
      } else {
        toast.error("不知道发生了什么错误😟");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="dialog-wrapper signin-dialog">
      <div className="dialog-container">
        <div className="dialog-header-container">
          <p className="title-text">👋 账号注册/登录</p>
          <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
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

export function showSigninDialog() {
  const div = document.createElement("div");
  document.body.append(div);

  const destory = () => {
    ReactDOM.unmountComponentAtNode(div);
    div.remove();
  };

  ReactDOM.render(<SigninDialog destory={destory} />, div);
}
