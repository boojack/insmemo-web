import { useContext, useEffect } from "react";
import appContext from "./labs/appContext";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";

function App() {
  const {
    globalState: { showDarkMode },
  } = useContext(appContext);

  useEffect(() => {
    if (showDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [showDarkMode]);

  return (
    <Router>
      <Switch>
        <Route exact path="/signin">
          <Signin />
        </Route>
        <Route path="*">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
