import { useCallback, useContext, useState } from "react";
import appContext from "../stores/appContext";
import { locationService } from "../services";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import utils from "../helpers/utils";
import Only from "./common/OnlyWhen";
import MenuBtnsPopup from "./MenuBtnsPopup";
import showDailyMemoDiaryDialog from "./DailyMemoDiaryDialog";
import "../less/user-banner.less";

interface Props {}

const UserBanner: React.FC<Props> = () => {
  const {
    memoState: { memos, tags },
    globalState: { isMobileView },
    userState: { user },
  } = useContext(appContext);
  const username = user ? user.username : "Memos";
  const createdDays = user ? Math.ceil((Date.now() - utils.getTimeStampByDate(user.createdAt)) / 1000 / 3600 / 24) : 0;

  const [shouldShowPopupBtns, setShouldShowPopupBtns] = useState(false);

  const handleUsernameClick = useCallback(() => {
    locationService.pushHistory("/");
    locationService.clearQuery();
  }, []);

  const handlePopupBtnClick = () => {
    const sidebarEl = document.querySelector(".sidebar-wrapper") as HTMLElement;
    const popupEl = document.querySelector(".menu-btns-popup") as HTMLElement;
    popupEl.style.top = 54 - sidebarEl.scrollTop + "px";
    setShouldShowPopupBtns(true);
  };

  const handleCloseSidebarBtnClick = () => {
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
    pageContainerEl?.classList.remove(MOBILE_ADDITION_CLASSNAME);
  };

  return (
    <div className="user-banner-container">
      <div className="userinfo-header-container">
        <p className="username-text" onClick={handleUsernameClick}>
          {username}
        </p>
        <span className="action-btn menu-popup-btn" onClick={handlePopupBtnClick}>
          <img src="/icons/more.svg" className="icon-img" />
        </span>
        <Only when={isMobileView}>
          <span className="action-btn hide-sidebar-btn" onClick={handleCloseSidebarBtnClick}>
            <img src="/icons/close.svg" className="icon-img" />
          </span>
        </Only>
        <MenuBtnsPopup shownStatus={shouldShowPopupBtns} setShownStatus={setShouldShowPopupBtns} />
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
