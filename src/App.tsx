import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { userService } from "./helpers/userService";
import { MainEditor } from "./components/MainEditor";
import { MemoList } from "./components/MemoList";
import { Sidebar } from "./components/Sidebar";
import { showSigninDialog } from "./components/Dialog";
import "./helpers/polyfill";
import "./less/global.less";
import "./less/index.less";

function App() {
  useEffect(() => {
    userService.init().then(() => {
      if (!userService.checkIsSignIn()) {
        showSigninDialog();
      }
    });
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
