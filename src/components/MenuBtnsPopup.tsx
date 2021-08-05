import React from "react";
import userService from "../helpers/userService";
import showMyAccountDialog from "./MyAccountDialog";
import showAboutSiteDialog from "./AboutSiteDialog";
import showPreferencesDialog from "./PreferencesDialog";
import "../less/menu-btns-popup.less";

interface Props {
  visibility: boolean;
}

const MenuBtnsPopup: React.FC<Props> = ({ visibility }) => {
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
    <div className={"menu-btns-popup " + (visibility ? "" : "hidden")}>
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

export default MenuBtnsPopup;
