import Memos from "../pages/Memos";
import MemoTrash from "../pages/MemoTrash";
import Setting from "../pages/Setting";

const homeRouter = {
  "/trash": <MemoTrash />,
  "/setting": <Setting />,
  "*": <Memos />,
};

export default homeRouter;
