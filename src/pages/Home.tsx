import { useContext, useEffect } from "react";
import { locationService, memoService, userService } from "../services";
import { homeRouterSwitch } from "../routers";
import appContext from "../labs/appContext";
import Sidebar from "../components/Sidebar";
import useLoading from "../hooks/useLoading";
import "../less/index.less";

function Home() {
  const {
    locationState: { pathname },
  } = useContext(appContext);
  const loadingState = useLoading();

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
          locationService.replaceHistory("/signin");
        }
      });
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      locationService.clearQuery();
    }
  }, [pathname]);

  return (
    <>
      {loadingState.isLoading ? null : (
        <div id="page-container">
          <Sidebar />
          <div className="content-wrapper">{homeRouterSwitch(pathname)}</div>
        </div>
      )}
    </>
  );
}

export default Home;
