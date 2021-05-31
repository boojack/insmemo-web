import React, { useState } from "react";
import { api } from "../helpers/api";
import { validate, ValidatorConfig } from "../helpers/validator";
import userService from "../helpers/userService";
import { showDialog } from "./Dialog";
import { toast } from "./Toast";
import "../less/signin-dialog.less";

interface Props extends DialogProps {}

const validateConfig: ValidatorConfig = {
  minLength: 4,
  maxLength: 24,
  noSpace: true,
  noChinese: true,
};

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
        userService.dispatch({
          type: "SIGN_IN",
          payload: { user },
        });
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
        仅用于作品展示，因此注册暂时关闭；
        <br />
        可输入 <code>guest, 123456</code> 进行体验。
        <br />
        如有进一步使用需求，请邮件联系：
        <br />
        <a href="mailto:lishuang@email.justsven.top">lishuang@email.justsven.top</a>
      </p>
    </>
  );
};

export function showSigninDialog() {
  showDialog(
    {
      className: "signin-dialog",
      clickSpaceDestory: false,
    },
    SigninDialog,
    {}
  );
}
