import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Provider from "./labs/Provider";
import appContext from "./labs/appContext";
import appStore from "./stores";
import { storage } from "./helpers/storage";
import { memoService, userService } from "./services";
import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import MemoEditor from "./components/MemoEditor";
import MemoList from "./components/MemoList";
import showSigninDialog from "./components/SigninDialog";
import "./helpers/polyfill";
import "./less/global.less";
import "./less/index.less";

function App() {
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

    const handleStorageDataChanged = () => {
      const showDarkMode = storage.preferences.showDarkMode ?? false;
      if (showDarkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    };

    handleStorageDataChanged();
    window.addEventListener("storage", handleStorageDataChanged);

    return () => {
      window.removeEventListener("storage", handleStorageDataChanged);
    };
  }, []);

  return (
    <div id="page-container">
      <Sidebar />
      <div className="content-wrapper">
        <MobileHeader />
        <MemoEditor />
        <MemoList />
      </div>
    </div>
  );
}

ReactDOM.render(
  <Provider store={appStore} context={appContext}>
    <App />
  </Provider>,
  document.getElementById("root")
);
