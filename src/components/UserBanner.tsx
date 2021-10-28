import { useCallback, useContext } from "react";
import { locationService } from "../services";
import appContext from "../labs/appContext";
import MenuBtnsPopup from "./MenuBtnsPopup";
import showDailyMemoDiaryDialog from "./DailyMemoDiaryDialog";
import * as utils from "../helpers/utils";
import "../less/user-banner.less";

interface Props {}

const UserBanner: React.FC<Props> = () => {
  const {
    userState: { user },
    memoState: { memos, tags },
  } = useContext(appContext);
  const username = user ? user.username : "Memos";
  const createdDays = user ? Math.ceil((Date.now() - utils.getTimeStampByDate(user.createdAt)) / 1000 / 3600 / 24) : 0;

  const handleUsernameClick = useCallback(() => {
    locationService.pushHistory("/");
    locationService.clearQuery();
  }, []);

  const handlePopupBtnClick = () => {
    const sidebarEl = document.querySelector(".sidebar-wrapper") as HTMLElement;
    const popupEl = document.querySelector(".menu-btns-popup") as HTMLElement;
    popupEl.style.top = 54 - sidebarEl.scrollTop + "px";
  };

  return (
    <div className="user-banner-container">
      <div className="userinfo-header-container">
        <p className="username-text" onClick={handleUsernameClick}>
          {username}
        </p>
        <span className="action-btn menu-popup-btn" onMouseEnter={handlePopupBtnClick}>
          <img src="/icons/more.svg" className="icon-img" />
        </span>
        <MenuBtnsPopup />
      </div>
      <div className="status-text-container">
        <div className="status-text memos-text">
          <span className="amount-text">{memos.length}</span>
          <span className="type-text">MEMO</span>
        </div>
        <div className="status-text tags-text">
          <span className="amount-text">{tags.length}</span>
          <span className="type-text">TAG</span>
        </div>
        <div className="status-text duration-text" onClick={() => showDailyMemoDiaryDialog()}>
          <span className="amount-text">{createdDays}</span>
          <span className="type-text">DAY</span>
        </div>
      </div>
    </div>
  );
};

export default UserBanner;
