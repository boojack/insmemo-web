import { useEffect } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { locationService, memoService, userService } from "../services";
import Sidebar from "../components/Sidebar";
import Memos from "./Memos";
import MemoTrash from "./MemoTrash";
import useLoading from "../hooks/useLoading";
import "../less/index.less";

function Home() {
  const loadingState = useLoading();
  const history = useHistory();
  const location = useLocation();

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

  useEffect(() => {
    locationService.clearQuery();
  }, [location.pathname]);

  return (
    <>
      {loadingState.isLoading ? (
        <></>
      ) : (
        <div id="page-container">
          <Sidebar />
          <div className="content-wrapper">
            <Switch>
              <Route exact path="/trash">
                <MemoTrash />
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
