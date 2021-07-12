import React, { useEffect, useRef, useState } from "react";
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
        <p className="title-text">
          <span className="icon-text">👋</span> 账号注册 / 登录
        </p>
      </div>
      <div className="dialog-content-container">
        <label className="form-label input-form-label">
          <input type="text" value={username} onChange={handleUsernameInputChanged} />
          <span className={"normal-text " + (username === "" ? "" : "not-null")}>用户名</span>
        </label>
        <label className="form-label input-form-label">
          <input type="password" value={password} onChange={handlePasswordInputChanged} />
          <span className={"normal-text " + (password === "" ? "" : "not-null")}>密码</span>
        </label>
      </div>
      <div className="dialog-footer-container">
        <div className="btns-container">
          <a href="https://github.com/login/oauth/authorize?client_id=187ba36888f152b06612&scope=read:user,gist">Login with Github</a>
        </div>
        <div className="btns-container">
          <button className="text-btn signup-btn disabled" onClick={() => handleActionBtnClick("signup")}>
            注册
          </button>
          <span className="split-text">/</span>
          <button className="text-btn signin-btn" ref={signinBtn} onClick={() => handleActionBtnClick("signin")}>
            登录
          </button>
        </div>
      </div>
      <p className="tip-text">
        仅用于作品展示，注册暂时关闭；
        <br />
        可输入 <code>guest, 123456</code> 进行体验。
        <br />
        <span className="text-btn" onClick={handleAboutBtnClick}>
          <span className="icon-text">😀</span>
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
