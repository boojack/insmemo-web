import { locationService, userService } from "../services";
import showMyAccountDialog from "./MyAccountDialog";
import showAboutSiteDialog from "./AboutSiteDialog";
import showPreferencesDialog from "./PreferencesDialog";
import "../less/menu-btns-popup.less";

interface Props {}

const MenuBtnsPopup: React.FC<Props> = () => {
  const handlePopupClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleMyAccountBtnClick = () => {
    showMyAccountDialog();
  };

  const handlePreferencesBtnClick = () => {
    showPreferencesDialog();
  };

  const handleMemosTrashBtnClick = () => {
    locationService.pushHistory("/trash");
  };

  const handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };

  const handleSignOutBtnClick = async () => {
    await userService.doSignOut();
    locationService.replaceHistory("/signin");
  };

  return (
    <div className="menu-btns-popup" onClick={handlePopupClick}>
      <button className="text-btn action-btn" onClick={handleMyAccountBtnClick}>
        <span className="icon">👤</span> 我的账号
      </button>
      <button className="text-btn action-btn" onClick={handlePreferencesBtnClick}>
        <span className="icon">⚙️</span> 偏好设置
      </button>
      <button className="text-btn action-btn" onClick={handleMemosTrashBtnClick}>
        <span className="icon">🗑️</span> 回收站
      </button>
      <button className="text-btn action-btn" onClick={handleAboutBtnClick}>
        <span className="icon">🤠</span> 关于
      </button>
      <button className="text-btn action-btn" onClick={handleSignOutBtnClick}>
        <span className="icon">👋</span> 退出
      </button>
    </div>
  );
};

export default MenuBtnsPopup;
