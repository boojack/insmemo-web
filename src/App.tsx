import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "./helpers/consts";
import userService from "./helpers/userService";
import memoService from "./helpers/memoService";
import locationService from "./helpers/locationService";
import MainEditor from "./components/MainEditor";
import MemoList from "./components/MemoList";
import Sidebar from "./components/Sidebar";
import showSigninDialog from "./components/SigninDialog";
import "./helpers/polyfill";
import "./less/global.less";
import "./less/index.less";

function App() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    userService.doSignIn().then(() => {
      const { user } = userService.getState();
      if (user) {
        setUsername(user.username);
        locationService.initQuery();
        memoService.fetchMoreMemos();
      } else {
        setUsername("insmemo");
        showSigninDialog();
      }
    });

    const unsubscribeUserStore = userService.subscribe(({ user }) => {
      if (user) {
        setUsername(user.username);
      }
    });

    return () => {
      unsubscribeUserStore();
    };
  }, []);

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
    <div id="page-container">
      <Sidebar />
      <div className="content-wrapper">
        <div className="mobile-header-container">
          <p className="username-text" onClick={handleUsernameClick}>
            {username}
          </p>
          <button className="action-btn show-sidebar" onClick={handleMoreActionBtnClick}>
            <img className="icon-img" src="/icons/fold.svg" alt="fold" />
          </button>
        </div>
        <MainEditor />
        <MemoList />
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
