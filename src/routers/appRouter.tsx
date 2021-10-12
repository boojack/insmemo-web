import Home from "../pages/Home";
import Signin from "../pages/Signin";

const router: Router = {
  "/signin": <Signin />,
  "*": <Home />,
};

const routerSwitch = (pathname: string) => {
  for (const key of Object.keys(router)) {
    if (key === pathname) {
      return router[key];
    }
  }
  return router["*"];
};

export default routerSwitch;
