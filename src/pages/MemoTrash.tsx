import { useCallback, useEffect, useState } from "react";
import useLoading from "../hooks/useLoading";
import { memoService } from "../services";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import DeletedMemo from "../components/DeletedMemo";
import "../less/memos-header.less";
import "../less/memo-trash.less";

interface Props {}

const MemoTrash: React.FC<Props> = () => {
  const loadingState = useLoading();
  const [deletedMemos, setDeletedMemos] = useState<Model.Memo[]>([]);

  useEffect(() => {
    memoService.fetchDeletedMemos().then((result) => {
      if (result !== false) {
        setDeletedMemos(result);
      }
      loadingState.setFinish();
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
      <div className="section-header-container">
        <div className="title-text">
          <button className="action-btn" onClick={handleMoreActionBtnClick}>
            <img className="icon-img" src="/icons/menu.svg" alt="menu" />
          </button>
          <span className="normal-text">回收站</span>
        </div>
      </div>
      {loadingState.isLoading ? (
        <div className="tip-text-container">
          <p className="tip-text">努力请求数据中...</p>
        </div>
      ) : deletedMemos.length === 0 ? (
        <div className="tip-text-container">
          <p className="tip-text">Here is No Zettels.</p>
        </div>
      ) : (
        <div className="deleted-memos-container">
          {deletedMemos.map((memo) => (
            <DeletedMemo key={`${memo.id}-${memo.updatedAt}`} memo={memo} handleDeletedMemoAction={handleDeletedMemoAction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoTrash;
