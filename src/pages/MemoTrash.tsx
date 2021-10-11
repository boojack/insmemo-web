import { useCallback, useEffect, useState } from "react";
import { memoService } from "../services";
import DeletedMemo from "../components/DeletedMemo";
import "../less/memo-trash.less";

interface Props {}

const MemoTrash: React.FC<Props> = () => {
  const [deletedMemos, setDeletedMemos] = useState<Model.Memo[]>([]);

  useEffect(() => {
    memoService.fetchDeletedMemos().then((result) => {
      if (result !== false) {
        setDeletedMemos(result);
      }
    });
  }, []);

  const handleDeletedMemoAction = useCallback(
    (memoId: string) => {
      setDeletedMemos(deletedMemos.filter((m) => m.id !== memoId));
    },
    [deletedMemos]
  );

  return (
    <div className="memo-trash-wrapper">
      <div className="header-container">
        <p className="title-text">回收站</p>
      </div>
      {deletedMemos.map((memo) => (
        <DeletedMemo key={`${memo.id}-${memo.updatedAt}`} memo={memo} handleDeletedMemoAction={handleDeletedMemoAction} />
      ))}
    </div>
  );
};

export default MemoTrash;
