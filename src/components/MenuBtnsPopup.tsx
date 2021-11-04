import { locationService, userService } from "../services";
import showAboutSiteDialog from "./AboutSiteDialog";
import "../less/menu-btns-popup.less";

interface Props {}

const MenuBtnsPopup: React.FC<Props> = () => {
  const handlePopupClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleMyAccountBtnClick = () => {
    locationService.pushHistory("/setting");
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
        <span className="icon">👤</span> 账号与设置
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
