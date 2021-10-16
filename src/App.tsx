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
    if (showDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    globalStateService.setIsMobileView(document.body.clientWidth <= 875);

    const handleWindowResize = () => {
      globalStateService.setIsMobileView(document.body.clientWidth <= 875);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [showDarkMode]);

  return <>{appRouterSwitch(pathname)}</>;
}

export default App;
