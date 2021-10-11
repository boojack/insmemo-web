import { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import { memoService, userService } from "../services";
import Sidebar from "../components/Sidebar";
import Memos from "./Memos";
import useLoading from "../hooks/useLoading";
import "../less/index.less";

function Home() {
  const loadingState = useLoading();
  const history = useHistory();

  useEffect(() => {
    userService
      .doSignIn()
      .catch(() => {
        // do nth
      })
      .finally(() => {
        if (userService.getState().user) {
          memoService.fetchMoreMemos();
          loadingState.setFinish();
        } else {
          history.replace("/signin");
        }
      });
  }, []);

  return (
    <>
      {loadingState.isLoading ? (
        <></>
      ) : (
        <div id="page-container">
          <Sidebar />
          <div className="content-wrapper">
            <Switch>
              <Route exact path="/recycle">
                <p>recycle</p>
              </Route>
              <Route exact path="/">
                <Memos />
              </Route>
            </Switch>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
