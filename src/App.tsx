import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Editor } from "./components/Editor";
import { MemoList } from "./components/MemoList";
import { Sidebar } from "./components/Sidebar";
import { showSigninDialog } from "./components/SigninDialog";
import { userService } from "./helpers/userService";
import { useToggle } from "./hooks/useToggle";
import "./less/global.less";
import "./less/index.less";

function App() {
  const [loading, toggleLoading] = useToggle(true);

  useEffect(() => {
    userService.init().then(() => {
      toggleLoading();
      if (!userService.checkIsSignIn()) {
        showSigninDialog();
      }
    });
  }, []);

  return (
    <div id="page-container">
      {loading ? (
        ""
      ) : (
        <>
          <Sidebar />
          <div className="content-wrapper">
            <Editor />
            <MemoList />
          </div>
        </>
      )}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
    <div className="toast-list-container"></div>
  </React.StrictMode>,
  document.getElementById("root")
);
