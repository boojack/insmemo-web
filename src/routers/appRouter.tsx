import Home from "../pages/Home";
import Signin from "../pages/Signin";

const appRouter: Router = {
  "/signin": <Signin />,
  "*": <Home />,
};

export default appRouter;
