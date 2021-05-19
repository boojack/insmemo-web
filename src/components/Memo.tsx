import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import { stateManager } from "../helpers/stateManager";
import { showMemoStoryDialog } from "./MemoStoryDialog";
import "../less/memo.less";

interface Props {
  memo: Model.Memo;
  index: number;
  delete: (idx: number) => Promise<void>;
}

interface MemoItem extends Model.Memo {
  formatedContent: string;
  createdAtStr: string;
}

export function Memo(props: Props) {
  const { memo: propsMemo } = props;
  const [memo, setMemo] = useState<MemoItem>({
    ...propsMemo,
    formatedContent: utils.filterMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  });
  const [uponMemo, setUponMemo] = useState<MemoItem>();
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const [showEditActionBtn, toggleEditActionBtn] = useToggle(false);

  useEffect(() => {
    const { uponMemoId } = memo;

    if (uponMemoId) {
      const { uponMemo: uponMemoData } = memo;

      if (uponMemoData) {
        setUponMemo({
          ...uponMemoData,
          formatedContent: utils.filterMemoContent(uponMemoData.content),
          createdAtStr: utils.getTimeString(uponMemoData.createdAt),
        });
      }
    }
  }, []);

  const showStoryDialog = () => {
    showMemoStoryDialog(memo.id);
  };

  const uponThisMemo = () => {
    stateManager.setState("uponMemoId", memo.id);
  };

  const deleteMemo = async () => {
    await props.delete(props.index);
  };

  const editMemo = () => {
    toggleEditActionBtn();
  };

  let edidContent = memo.content;

  const handleEditorContentChanged = (e: React.FormEvent<HTMLDivElement>) => {
    const rawContent = e.currentTarget.innerHTML;

    edidContent = rawContent;
  };

  const saveEditedMemo = async () => {
    if (edidContent === memo.content) {
      toggleEditActionBtn();
      return;
    }

    await api.updateMemo(memo.id, edidContent);

    setMemo({
      ...memo,
      content: edidContent,
      formatedContent: utils.filterMemoContent(edidContent),
    });
    toggleEditActionBtn();
  };

  const cancelEditMemo = () => {
    edidContent = memo.content;
    toggleEditActionBtn();
  };

  const handleMouseLeaveMemoWrapper = () => {
    if (showEditActionBtn) {
      cancelEditMemo();
    }
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn();
    }
  };

  return (
    <div className="memo-wrapper" onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text">{memo.createdAtStr}</span>
        <div className="btns-container">
          {uponMemo ? (
            <span className="text-btn" onClick={showStoryDialog}>
              All
            </span>
          ) : null}
          <span className="text-btn" onClick={uponThisMemo}>
            Mark
          </span>
          {/* Memo 编辑相关按钮 */}
          {showEditActionBtn ? (
            <>
              <span className="text-btn" onClick={saveEditedMemo}>
                保存
              </span>
              <span className="text-btn" onClick={cancelEditMemo}>
                撤销
              </span>
            </>
          ) : (
            <span className="text-btn" onClick={editMemo}>
              编辑
            </span>
          )}
          {/* Memo 删除相关按钮 */}
          {showConfirmDeleteBtn ? (
            <span className="text-btn" onClick={deleteMemo}>
              确定删除
            </span>
          ) : (
            <span className="text-btn" onClick={toggleConfirmDeleteBtn}>
              删除
            </span>
          )}
        </div>
      </div>
      {/* 这里如果不设置 key，react 会尝试重用 */}
      {showEditActionBtn ? (
        <div
          key="memo-editor"
          className="memo-editor memo-content-text"
          contentEditable
          onInput={handleEditorContentChanged}
          dangerouslySetInnerHTML={{ __html: memo.content }}
        ></div>
      ) : (
        <div key="memo-content" className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formatedContent }}></div>
      )}
      {uponMemo ? (
        <div className="uponmemo-container">
          <span className="icon-text">📌</span>
          <div className="uponmemo-content-text" dangerouslySetInnerHTML={{ __html: uponMemo.formatedContent }}></div>
        </div>
      ) : null}
    </div>
  );
}
