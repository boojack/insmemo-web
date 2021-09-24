import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Provider from "./labs/Provider";
import appContext from "./labs/appContext";
import appStore from "./stores";
import { memoService, userService } from "./services";
import MobileHeader from "./components/MobileHeader";
import MemoEditor from "./components/MemoEditor";
import MemoList from "./components/MemoList";
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/Sidebar";
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
  }, []);

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
      <SearchBar />
    </>
  );
}

ReactDOM.render(
  <Provider store={appStore} context={appContext}>
    <App />
  </Provider>,
  document.getElementById("root")
);
