import MemoEditor from "../components/MemoEditor";
import MemosHeader from "../components/MemosHeader";
import MemoList from "../components/MemoList";
import "../less/index.less";

function Memos() {
  return (
    <>
      <MemosHeader />
      <MemoEditor />
      <MemoList />
    </>
  );
}

export default Memos;
