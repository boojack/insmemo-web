import { useContext, useEffect } from "react";
import { locationService, userService } from "../services";
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
    const { user } = userService.getState();
    if (!user) {
      userService
        .doSignIn()
        .then((user) => {
          if (user) {
            loadingState.setFinish();
          } else {
            locationService.replaceHistory("/signin");
          }
        })
        .catch(() => {
          // do nth
        });
    } else {
      loadingState.setFinish();
    }
  }, []);

  return (
    <>
      {loadingState.isLoading ? null : (
        <section id="page-container">
          <Sidebar />
          <main className="content-wrapper">{homeRouterSwitch(pathname)}</main>
        </section>
      )}
    </>
  );
}

export default Home;
