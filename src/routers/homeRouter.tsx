import Memos from "../pages/Memos";
import MemoTrash from "../pages/MemoTrash";

const router: Router = {
  "/trash": <MemoTrash />,
  "*": <Memos />,
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
