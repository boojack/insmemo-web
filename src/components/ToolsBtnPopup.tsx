import React from "react";
import { userService } from "../helpers/userService";
import { showAboutSiteDialog } from "./AboutSiteDialog";
import { showPreferencesDialog } from "./PreferencesDialog";
import "../less/tools-btn-popup.less";

interface Props {
  visibility: boolean;
}

export function ToolsBtnPopup(props: Props) {
  const { visibility } = props;

  const handlePreferencesBtnClick = () => {
    showPreferencesDialog();
  };

  const handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };

  const handleFeedbackBtnClick = () => {
    window.open("https://github.com/boojack/insmemo/issues/new");
  };

  const handleSignoutBtnClick = async () => {
    await userService.doSignOut();
    location.reload();
  };

  return (
    <div className={"tools-btn-popup " + (visibility ? "" : "hidden")}>
      <button className="text-btn action-btn" onClick={handlePreferencesBtnClick}>
        <span className="icon">🤟</span> 偏好设置
      </button>
      <button className="text-btn action-btn" onClick={handleAboutBtnClick}>
        <span className="icon">😀</span> 关于
      </button>
      <button className="text-btn action-btn" onClick={handleFeedbackBtnClick}>
        <span className="icon">🐛</span> 问题反馈
      </button>
      <button className="text-btn action-btn" onClick={handleSignoutBtnClick}>
        <span className="icon">👋</span> 退出
      </button>
    </div>
  );
}
