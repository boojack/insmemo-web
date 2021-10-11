import { useCallback, useEffect, useState } from "react";
import { memoService } from "../services";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import DeletedMemo from "../components/DeletedMemo";
import "../less/memo-trash.less";
import "../less/memos-header.less";

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

  const handleMoreActionBtnClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);

    if (pageContainerEl) {
      pageContainerEl.classList.add(MOBILE_ADDITION_CLASSNAME);
    }
  }, []);

  return (
    <div className="memo-trash-wrapper">
      <div className="header-container">
        <div className="title-text">
          <button className="action-btn" onClick={handleMoreActionBtnClick}>
            <img className="icon-img" src="/icons/fold.svg" alt="fold" />
          </button>
          回收站
        </div>
      </div>
      {deletedMemos.map((memo) => (
        <DeletedMemo key={`${memo.id}-${memo.updatedAt}`} memo={memo} handleDeletedMemoAction={handleDeletedMemoAction} />
      ))}
    </div>
  );
};

export default MemoTrash;