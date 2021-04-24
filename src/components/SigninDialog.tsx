import React, { useState } from "react";
import { api } from "../helpers/api";
import { userService } from "../helpers/userService";
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
      if (action === "signin") {
        await api.signin(username, password);
      } else {
        await api.signup(username, password);
      }

      await userService.doSignIn();
      if (userService.getUserInfo()) {
        close();
      }
    } catch (error) {
      // NOTE: 在这里处理响应错误
      alert(error.message);
    }
  };

  return (
    <div className="dialog-wrapper">
      <div className="dialog-container signin-dialog">
        <div className="dialog-header-container">
          <p className="title-text">Sign in/up</p>
          <button className="text-btn close-btn" onClick={close}>
            close
          </button>
        </div>
        <div className="dialog-content-container">
          <input type="text" value={username} onChange={handleUsernameChanged} />
          <input type="password" value={password} onChange={handlePasswordChanged} />
        </div>
        <div className="dialog-footer-container">
          <button className="text-btn signup-btn" onClick={() => handleSigninBtnClick("signup")}>
            Sign up
          </button>
          <button className="text-btn signin-btn" onClick={() => handleSigninBtnClick("signin")}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
