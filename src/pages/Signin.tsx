import { useEffect, useRef, useState } from "react";
import * as api from "../helpers/api";
import { validate, ValidatorConfig } from "../helpers/validator";
import { locationService, userService } from "../services";
import showAboutSiteDialog from "../components/AboutSiteDialog";
import toastHelper from "../components/Toast";
import "../less/signin.less";

interface Props {}

const validateConfig: ValidatorConfig = {
  minLength: 4,
  maxLength: 24,
  noSpace: true,
  noChinese: true,
};

const Signin: React.FC<Props> = () => {
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
        locationService.replaceHistory("/");
      } else {
        toastHelper.error("😟 登录失败");
      }
    } catch (error: any) {
      console.error(error);
      toastHelper.error("😟 " + error.message);
    }
  };

  return (
    <div className="page-wrapper signin">
      <div className="page-container">
        <div className="page-header-container">
          <p className="title-text">
            <span className="icon-text">👋</span> 账号注册 / 登录
          </p>
        </div>
        <div className="page-content-container">
          <div className="form-item-container input-form-container">
            <span className={"normal-text " + (username === "" ? "" : "not-null")}>账号</span>
            <input type="text" value={username} onChange={handleUsernameInputChanged} />
          </div>
          <div className="form-item-container input-form-container">
            <span className={"normal-text " + (password === "" ? "" : "not-null")}>密码</span>
            <input type="password" value={password} onChange={handlePasswordInputChanged} />
          </div>
        </div>
        <div className="page-footer-container">
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
      </div>
    </div>
  );
};

export default Signin;
