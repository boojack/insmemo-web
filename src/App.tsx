import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import userService from "./helpers/userService";
import memoService from "./helpers/memoService";
import { MainEditor } from "./components/MainEditor";
import { MemoList } from "./components/MemoList";
import { Sidebar } from "./components/Sidebar";
import { showSigninDialog } from "./components/SigninDialog";
import "./helpers/polyfill";
import "./less/global.less";
import "./less/index.less";

function App() {
  useEffect(() => {
    userService.doSignIn().then(() => {
      const { user } = userService.getState();
      if (!user) {
        showSigninDialog();
      }
    });

    const unsubscribeUserStore = userService.subscribe(async ({ user }) => {
      if (user) {
        await memoService.fetchMoreMemos();
      }
    });

    return () => {
      unsubscribeUserStore();
    };
  }, []);

  return (
    <div id="page-container">
      <Sidebar />
      <div className="content-wrapper">
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
