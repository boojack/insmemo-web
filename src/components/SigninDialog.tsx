import React, { useState } from "react";
import { api } from "../helpers/api";
import { validate, ValidatorConfig } from "../helpers/validator";
import userService from "../helpers/userService";
import memoService from "../helpers/memoService";
import { showDialog } from "./Dialog";
import showAboutSiteDialog from "./AboutSiteDialog";
import toast from "./Toast";
import "../less/signin-dialog.less";

interface Props extends DialogProps {}

const validateConfig: ValidatorConfig = {
  minLength: 4,
  maxLength: 24,
  noSpace: true,
  noChinese: true,
};

const SigninDialog: React.FunctionComponent<Props> = (props) => {
  const { destroy } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };

  const handlePasswordInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };

  const handleActionBtnClick = async (action: "signin" | "signup") => {
    if (action === "signup") {
      toast.info("注册已关闭");
      return;
    }

    const usernameValidResult = validate(username, validateConfig);
    if (!usernameValidResult.result) {
      toast.error("用户名 " + usernameValidResult.reason);
      return;
    }

    const passwordValidResult = validate(password, validateConfig);
    if (!passwordValidResult.result) {
      toast.error("密码 " + passwordValidResult.reason);
      return;
    }

    try {
      const actionFunc = action === "signin" ? api.signin : api.signup;
      const { succeed, message } = await actionFunc(username, password);

      if (!succeed && message) {
        toast.error("😟 " + message);
        return;
      }

      const user = await userService.doSignIn();

      if (user) {
        memoService.fetchMoreMemos();
        destroy();
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
      </div>
      <div className="dialog-content-container">
        <input type="text" value={username} minLength={4} maxLength={24} placeholder="用户名" onChange={handleUsernameInputChanged} />
        <input type="password" value={password} minLength={4} maxLength={24} placeholder="密码" onChange={handlePasswordInputChanged} />
      </div>
      <div className="dialog-footer-container">
        <span></span>
        <div className="btns-container">
          <button className="text-btn signup-btn disabled" onClick={() => handleActionBtnClick("signup")}>
            注册
          </button>
          <span className="split-text">/</span>
          <button className="text-btn signin-btn" onClick={() => handleActionBtnClick("signin")}>
            登录
          </button>
        </div>
      </div>
      <p className="tip-text">
        仅用于作品展示，注册暂时关闭；可输入 <code>guest, 123456</code> 进行体验。
        <span className="text-btn" onClick={handleAboutBtnClick}>
          关于本站
        </span>
      </p>
    </>
  );
};

export default function showSigninDialog() {
  showDialog(
    {
      className: "signin-dialog",
      clickSpaceDestroy: false,
    },
    SigninDialog,
    {}
  );
}
