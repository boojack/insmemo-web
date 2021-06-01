import React, { useCallback, useEffect, useState } from "react";
import { api } from "../helpers/api";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import userService from "../helpers/userService";
import memoService from "../helpers/memoService";
import locationService from "../helpers/locationService";
import { ToolsBtnPopup } from "./ToolsBtnPopup";
import "../less/user-banner.less";

interface AmountState {
  memosAmount: number;
  tagsAmount: number;
}

export const UserBanner: React.FunctionComponent = () => {
  const [username, setUsername] = useState<string>("");
  const [createdDays, setCreatedDays] = useState<number>(0);
  const [amountState, setAmountState] = useState<AmountState>({
    memosAmount: 0,
    tagsAmount: 0,
  });
  const [showToolsBtnDialog, setDialogStatus] = useState<boolean>(false);

  useEffect(() => {
    const fetchDataAmount = async () => {
      const { data } = await api.getMyDataAmount();

      setAmountState({
        ...data,
      });
    };

    const unsubscribeMemoStore = memoService.subscribe(() => {
      fetchDataAmount();
    });

    const unsubscribeUserStore = userService.subscribe(({ user }) => {
      if (user) {
        setUsername(user.username);
        setCreatedDays(Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 1000 / 3600 / 24));
      } else {
        setUsername("insmemo");
      }
    });

    return () => {
      unsubscribeMemoStore();
      unsubscribeUserStore();
    };
  }, []);

  const toggleBtnsDialog = useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      const nextState = !showToolsBtnDialog;

      if (nextState) {
        const bodyClickHandler = () => {
          setDialogStatus(false);
          document.body.removeEventListener("click", bodyClickHandler);
        };

        document.body.addEventListener("click", bodyClickHandler);
      }

      setDialogStatus(nextState);
    },
    [showToolsBtnDialog]
  );

  const handleUsernameClick = useCallback(() => {
    locationService.setTagQuery("");
  }, []);

  const handleMoreActionBtnClick = useCallback(() => {
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);

    if (pageContainerEl) {
      if (pageContainerEl.classList.contains(MOBILE_ADDITION_CLASSNAME)) {
        pageContainerEl.classList.remove(MOBILE_ADDITION_CLASSNAME);
      } else {
        pageContainerEl.classList.add(MOBILE_ADDITION_CLASSNAME);
      }
    }
  }, []);

  return (
    <div className="user-banner-container">
      <div className="userinfo-header-container">
        <p className="username-text" onClick={handleUsernameClick}>
          {username}
        </p>
        <button className="action-btn tools-dialog-btn" onClick={toggleBtnsDialog}>
          ···
        </button>
        <button className="action-btn more-action-btn" onClick={handleMoreActionBtnClick}>
          <img className="icon-img" src="/icons/fold.svg" alt="fold" />
        </button>
        <ToolsBtnPopup visibility={showToolsBtnDialog} />
      </div>
      <div className="status-text-container">
        <div className="status-text memos-text">
          <span className="amount-text">{amountState.memosAmount}</span>
          <span className="type-text">MEMO</span>
        </div>
        <div className="status-text tags-text">
          <span className="amount-text">{amountState.tagsAmount}</span>
          <span className="type-text">TAG</span>
        </div>
        <div className="status-text duration-text">
          <span className="amount-text">{createdDays}</span>
          <span className="type-text">DAY</span>
        </div>
      </div>
    </div>
  );
};
