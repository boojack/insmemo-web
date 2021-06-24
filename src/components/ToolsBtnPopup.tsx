import React from "react";
import userService from "../helpers/userService";
import showMyAccountDialog from "./MyAccountDialog";
import showAboutSiteDialog from "./AboutSiteDialog";
import showPreferencesDialog from "./PreferencesDialog";
import "../less/tools-btn-popup.less";

interface Props {
  visibility: boolean;
}

export const ToolsBtnPopup: React.FC<Props> = ({ visibility }) => {
  const handlePreferencesBtnClick = () => {
    showPreferencesDialog();
  };

  const handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };

  const handleSignOutBtnClick = () => {
    userService.doSignOut();
    location.reload();
  };

  return (
    <div className={"tools-btn-popup " + (visibility ? "" : "hidden")}>
      <button className="text-btn action-btn" onClick={showMyAccountDialog}>
        <span className="icon">🤠</span> 我的账号
      </button>
      <button className="text-btn action-btn" onClick={handlePreferencesBtnClick}>
        <span className="icon">🤟</span> 偏好设置
      </button>
      <button className="text-btn action-btn" onClick={handleAboutBtnClick}>
        <span className="icon">😀</span> 关于
      </button>
      <button className="text-btn action-btn" onClick={handleSignOutBtnClick}>
        <span className="icon">👋</span> 退出
      </button>
    </div>
  );
};
