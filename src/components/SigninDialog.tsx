import React, { useEffect, useRef, useState } from "react";
import { api } from "../helpers/api";
import { validate, ValidatorConfig } from "../helpers/validator";
import { memoService, userService } from "../services";
import { showDialog } from "./Dialog";
import showAboutSiteDialog from "./AboutSiteDialog";
import toastHelper from "./Toast";
import "../less/signin-dialog.less";

interface Props extends DialogProps {}

const validateConfig: ValidatorConfig = {
  minLength: 4,
  maxLength: 24,
  noSpace: true,
  noChinese: true,
};

const SigninDialog: React.FC<Props> = ({ destroy }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const signinBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        signinBtn.current?.click();
      }
    };
    document.body.addEventListener("keypress", handleKeyPress);

    return () => {
      document.body.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const handleUsernameInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setUsername(text);
  };

  const handlePasswordInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setPassword(text);
  };

  const handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };

  const handleSignUpBtnClick = async () => {
    const usernameValidResult = validate(username, validateConfig);
    if (!usernameValidResult.result) {
      toastHelper.error("用户名 " + usernameValidResult.reason);
      return;
    }

    const passwordValidResult = validate(password, validateConfig);
    if (!passwordValidResult.result) {
      toastHelper.error("密码 " + passwordValidResult.reason);
      return;
    }

    try {
      const actionFunc = api.signup;
      const { succeed, message } = await actionFunc(username, password);

      if (!succeed && message) {
        toastHelper.error("😟 " + message);
        return;
      }

      const user = await userService.doSignIn();
      if (user) {
        memoService.fetchMoreMemos().catch(() => {
          // do nth
        });
        destroy();
      } else {
        toastHelper.error("😟 不知道发生了什么错误");
      }
    } catch (error: any) {
      console.error(error);
      toastHelper.error("😟 " + error.message);
    }
  };

  const handleSignInBtnClick = async () => {
    const usernameValidResult = validate(username, validateConfig);
    if (!usernameValidResult.result) {
      toastHelper.error("用户名 " + usernameValidResult.reason);
      return;
    }

    const passwordValidResult = validate(password, validateConfig);
    if (!passwordValidResult.result) {
      toastHelper.error("密码 " + passwordValidResult.reason);
      return;
    }

    try {
      const actionFunc = api.signin;
      const { succeed, message } = await actionFunc(username, password);

      if (!succeed && message) {
        toastHelper.error("😟 " + message);
        return;
      }

      const user = await userService.doSignIn();
      if (user) {
        memoService.fetchMoreMemos().catch(() => {
          // do nth
        });
        destroy();
      } else {
        toastHelper.error("😟 不知道发生了什么错误");
      }
    } catch (error: any) {
      console.error(error);
      toastHelper.error("😟 " + error.message);
    }
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">👋</span> 账号注册 / 登录
        </p>
      </div>
      <div className="dialog-content-container">
        <label className="form-label input-form-label">
          <input type="text" value={username} onChange={handleUsernameInputChanged} />
          <span className={"normal-text " + (username === "" ? "" : "not-null")}>账号</span>
        </label>
        <label className="form-label input-form-label">
          <input type="password" value={password} onChange={handlePasswordInputChanged} />
          <span className={"normal-text " + (password === "" ? "" : "not-null")}>密码</span>
        </label>
      </div>
      <div className="dialog-footer-container">
        <div className="btns-container">
          <a className="btn-text" href="https://github.com/login/oauth/authorize?client_id=187ba36888f152b06612&scope=read:user,gist">
            Sign In with GitHub
          </a>
        </div>
        <div className="btns-container">
          <button className="text-btn signup-btn disabled" onClick={() => toastHelper.info("注册已关闭")}>
            注册
          </button>
          <span className="split-text">/</span>
          <button className="text-btn signin-btn" ref={signinBtn} onClick={handleSignInBtnClick}>
            登录
          </button>
        </div>
      </div>
      <p className="tip-text">
        仅用于作品展示，可输入 <code>guest, 123456</code> 进行体验。
        <br />
        <span className="text-btn" onClick={handleAboutBtnClick}>
          <span className="icon-text">😀</span>
          关于本站
        </span>
      </p>
    </>
  );
};

export default function showSigninDialog(): void {
  showDialog(
    {
      className: "signin-dialog",
      clickSpaceDestroy: false,
    },
    SigninDialog
  );
}
