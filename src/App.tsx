import { useContext, useEffect } from "react";
import appContext from "./labs/appContext";
import { appRouterSwitch } from "./routers";

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
  }, [showDarkMode]);

  return <>{appRouterSwitch(pathname)}</>;
}

export default App;
