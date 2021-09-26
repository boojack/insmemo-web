import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import Provider from "./labs/Provider";
import appContext from "./labs/appContext";
import appStore from "./stores";
import { memoService, userService } from "./services";
import MobileHeader from "./components/MobileHeader";
import MemoEditor from "./components/MemoEditor";
import MemoList from "./components/MemoList";
import Sidebar from "./components/Sidebar";
import toggleSearchBarDialog from "./components/SearchBarDialog";
import showSigninDialog from "./components/SigninDialog";
import "./helpers/polyfill";
import "./less/global.less";
import "./less/index.less";

function App() {
  const {
    globalState: { showDarkMode },
  } = useContext(appContext);

  useEffect(() => {
    userService
      .doSignIn()
      .catch(() => {
        // do nth
      })
      .finally(() => {
        if (userService.getState().user) {
          memoService.fetchMoreMemos();
        } else {
          showSigninDialog();
        }
      });

    const handleSearchKeyDown = (event: KeyboardEvent) => {
      if (!userService.getState().user) {
        return;
      }

      const { ctrlKey, metaKey, code } = event;
      if ((ctrlKey || metaKey) && code === "KeyP") {
        event.preventDefault();
        toggleSearchBarDialog();
      }
    };

    window.addEventListener("keydown", handleSearchKeyDown);

    return () => {
      window.removeEventListener("keydown", handleSearchKeyDown);
    };
  }, []);

  useEffect(() => {
    if (showDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [showDarkMode]);

  return (
    <>
      <div id="page-container">
        <Sidebar />
        <div className="content-wrapper">
          <MobileHeader />
          <MemoEditor />
          <MemoList />
        </div>
      </div>
    </>
  );
}

ReactDOM.render(
  <Provider store={appStore} context={appContext}>
    <App />
  </Provider>,
  document.getElementById("root")
);
