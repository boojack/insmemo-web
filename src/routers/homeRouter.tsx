import Memos from "../pages/Memos";
import MemoTrash from "../pages/MemoTrash";

const homeRouter: Router = {
  "/trash": <MemoTrash />,
  "*": <Memos />,
};

export default homeRouter;
