import Memos from "../pages/Memos";
import MemoTrash from "../pages/MemoTrash";

const homeRouter = {
  "/trash": <MemoTrash />,
  "*": <Memos />,
};

export default homeRouter;
