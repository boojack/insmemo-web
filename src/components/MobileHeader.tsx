import React, { useCallback, useContext } from "react";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import appContext from "../labs/appContext";
import { locationService } from "../services";

interface Props {}

const MobileHeader: React.FC<Props> = () => {
  const {
    userState: { user },
  } = useContext(appContext);
  const username = user ? user.username : "Memos";

  const handleUsernameClick = useCallback(() => {
    locationService.clearQuery();
  }, []);

  const handleMoreActionBtnClick = useCallback(() => {
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);

    if (pageContainerEl) {
      pageContainerEl.classList.add(MOBILE_ADDITION_CLASSNAME);
    }
  }, []);

  return (
    <div className="mobile-header-container">
      <p className="username-text" onClick={handleUsernameClick}>
        {username}
      </p>
      <button className="action-btn show-sidebar" onClick={handleMoreActionBtnClick}>
        <img className="icon-img" src="/icons/fold.svg" alt="fold" />
      </button>
    </div>
  );
};

export default MobileHeader;
