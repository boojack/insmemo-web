import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import { stateManager } from "../helpers/stateManager";
import { showMemoStoryDialog } from "./MemoStoryDialog";
import "../less/memo.less";
import { preferences } from "./PreferencesDialog";

interface Props {
  memo: Model.Memo;
  index: number;
  shouldSplitMemoWord: boolean;
  delete: (idx: number) => Promise<void>;
}

interface MemoItem extends Model.Memo {
  formatedContent: string;
  createdAtStr: string;
}

export function Memo(props: Props) {
  const { memo: propsMemo, shouldSplitMemoWord } = props;
  const [memo, setMemo] = useState<MemoItem>({
    ...propsMemo,
    formatedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  });
  const [uponMemo, setUponMemo] = useState<MemoItem>();
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const [showEditActionBtn, toggleEditActionBtn] = useToggle(false);
  const [showMoreActionBtns, toggleMoreActionBtns] = useToggle(false);

  useEffect(() => {
    const { uponMemoId } = memo;

    if (uponMemoId) {
      const { uponMemo: uponMemoData } = memo;

      if (uponMemoData) {
        setUponMemo({
          ...uponMemoData,
          formatedContent: formatMemoContent(uponMemoData.content),
          createdAtStr: utils.getTimeString(uponMemoData.createdAt),
        });
      }
    }
  }, []);

  useEffect(() => {
    setMemo({
      ...memo,
      formatedContent: formatMemoContent(memo.content),
    });
  }, [shouldSplitMemoWord]);

  const showStoryDialog = () => {
    showMemoStoryDialog(memo.id);
  };

  const uponThisMemo = () => {
    stateManager.setState("uponMemoId", memo.id);
  };

  const handleDeleteMemoClick = async () => {
    if (showConfirmDeleteBtn) {
      await props.delete(props.index);
    } else {
      toggleConfirmDeleteBtn();
    }
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
      formatedContent: formatMemoContent(edidContent),
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
    if (showMoreActionBtns) {
      toggleMoreActionBtns();
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
          {showMoreActionBtns ? (
            <>
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
                <span className="text-btn" onClick={toggleEditActionBtn}>
                  编辑
                </span>
              )}
              {/* Memo 删除相关按钮 */}
              <span className="text-btn" onClick={handleDeleteMemoClick}>
                {showConfirmDeleteBtn ? "确定删除" : "删除"}
              </span>
            </>
          ) : null}
          <span className={"text-btn more-action-btns " + (showMoreActionBtns ? "active" : "")} onClick={toggleMoreActionBtns}>
            ···
          </span>
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

export function formatMemoContent(content: string): string {
  const tagReg = /#(.+?)#/g;
  const linkReg = /(https?:\/\/[^\s]+)/g;

  content = content.replaceAll("\n", "<br>");
  content = content.replaceAll(tagReg, "<span class='tag-span'>#$1</span>");
  content = content.replaceAll(linkReg, "<a target='_blank' href='$1'>$1</a>");

  // 中英文之间加空格，这里只是简单的用正则分开了，可优化
  if (preferences.shouldSplitMemoWord) {
    content = content.replaceAll(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;\[\]\(\)]+)([\u4e00-\u9fa5]?)/g, "$1 $2 $3");
  }

  return content;
}
