import React, { useCallback, useEffect, useState } from "react";
import { api } from "../helpers/api";
import toast from "./Toast";
import userService from "../helpers/userService";
import memoService from "../helpers/memoService";
import locationService from "../helpers/locationService";
import { ToolsBtnPopup } from "./ToolsBtnPopup";
import "../less/user-banner.less";

interface AmountState {
  memosAmount: number;
  tagsAmount: number;
}

const UserBanner: React.FunctionComponent = () => {
  const [username, setUsername] = useState<string>("insmemo");
  const [createdDays, setCreatedDays] = useState<number>(0);
  const [amountState, setAmountState] = useState<AmountState>({
    memosAmount: 0,
    tagsAmount: 0,
  });
  const [showToolsBtnDialog, setDialogStatus] = useState<boolean>(false);

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

    const unsubscribeMemoService = memoService.subscribe(() => {
      fetchDataAmount();
    });

    const unsubscribeUserService = userService.subscribe(({ user }) => {
      if (user) {
        setUsername(user.username);
        setCreatedDays(Math.ceil((Date.now() - new Date(user.createdAt).getTime()) / 1000 / 3600 / 24));
      } else {
        setUsername("insmemo");
      }
    });

    return () => {
      unsubscribeMemoService();
      unsubscribeUserService();
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
    locationService.clearQuery();
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
