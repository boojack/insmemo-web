import React, { useCallback, useEffect, useState } from "react";
import { api } from "../helpers/api";
import useSelector from "../hooks/useSelector";
import toast from "./Toast";
import userService from "../helpers/userService";
import memoService from "../helpers/memoService";
import locationService from "../helpers/locationService";
import MenuBtnsPopup from "./MenuBtnsPopup";
import showDailyMemoDiaryDialog from "./DailyMemoDiaryDialog";
import "../less/user-banner.less";

interface AmountState {
  memosAmount: number;
  tagsAmount: number;
}

const UserBanner: React.FC = () => {
  const { user } = useSelector(userService);
  const { memos } = useSelector(memoService);
  const [amountState, setAmountState] = useState<AmountState>({
    memosAmount: 0,
    tagsAmount: 0,
  });
  const [showMenuBtnsPopup, setPopupStatus] = useState<boolean>(false);
  const username = user ? user.username : "Memos";
  const createdDays = user ? Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 1000 / 3600 / 24) : 0;

  useEffect(() => {
    const fetchDataAmount = async () => {
      try {
        const data = await getMyDataAmount();

        setAmountState({
          ...data,
        });
      } catch (error) {
        toast.error(error);
      }
    };

    fetchDataAmount();
  }, [memos]);

  const toggleBtnsDialog = useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      const nextState = !showMenuBtnsPopup;

      if (nextState) {
        const bodyClickHandler = () => {
          setPopupStatus(false);
          document.body.removeEventListener("click", bodyClickHandler);
        };

        document.body.addEventListener("click", bodyClickHandler);
      }

      setPopupStatus(nextState);
    },
    [showMenuBtnsPopup]
  );

  const handleUsernameClick = useCallback(() => {
    locationService.clearQuery();
  }, []);

  return (
    <div className="user-banner-container">
      <div className="userinfo-header-container">
        <p className="username-text" onClick={handleUsernameClick}>
          {username}
        </p>
        <button className="action-btn menu-popup-btn" onClick={toggleBtnsDialog}></button>
        <MenuBtnsPopup visibility={showMenuBtnsPopup} />
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
        <div className="status-text duration-text" onClick={() => showDailyMemoDiaryDialog()}>
          <span className="amount-text">{createdDays}</span>
          <span className="type-text">DAY</span>
        </div>
      </div>
    </div>
  );
};

function getMyDataAmount(): Promise<Api.DataAmounts> {
  return new Promise((resolve, reject) => {
    api
      .getMyDataAmount()
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject("数据请求失败");
      });
  });
}

export default UserBanner;
