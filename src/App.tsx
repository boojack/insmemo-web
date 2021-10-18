import { useContext, useEffect } from "react";
import appContext from "./labs/appContext";
import { appRouterSwitch } from "./routers";
import { globalStateService } from "./services";

function App() {
  const {
    locationState: { pathname },
    globalState: { showDarkMode },
  } = useContext(appContext);

  useEffect(() => {
    const handleWindowResize = () => {
      globalStateService.setIsMobileView(document.body.clientWidth <= 875);
    };

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (showDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [showDarkMode]);

  return <>{appRouterSwitch(pathname)}</>;
}

export default App;
