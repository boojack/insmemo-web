import React, { useCallback, useEffect, useState } from "react";
import { api } from "../helpers/api";
import { storage } from "../helpers/storage";
import marked from "../helpers/marked";
import memoService from "../helpers/memoService";
import globalStateService from "../helpers/globalStateService";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import Image from "./Image";
import showMemoStoryDialog from "./MemoStoryDialog";
import showGenMemoImageDialog from "./GenMemoImageDialog";
import "../less/memo.less";

// 标签 正则
const TAG_REG = /#([^\n]+?)#/g;
// URL 正则
const LINK_REG = /(https?:\/\/[^\s<\\*>']+)/g;
// 图片路由正则
const IMAGE_URL_REG = /(https?:\/\/[^\s<\\*>']+\.(jpeg|jpg|gif|png|svg))/g;
// memo 关联正则
const MEMO_LINK_REG = /\[@(.+?)\]\((.+?)\)/g;

interface Props {
  className: string;
  memo: Model.Memo;
  index: number;
  shouldSplitMemoWord: boolean;
  delete: (idx: number) => Promise<void>;
}

const Memo: React.FunctionComponent<Props> = (props: Props) => {
  const { className, memo: propsMemo, shouldSplitMemoWord } = props;
  const [memo, setMemo] = useState<FormattedMemo>({
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const [showMoreActionBtns, toggleMoreActionBtns] = useToggle(false);

  useEffect(() => {
    setImageUrls(Array.from(memo.content.match(IMAGE_URL_REG) ?? []));
  }, [memo]);

  useEffect(() => {
    setMemo({
      ...memo,
      formattedContent: formatMemoContent(memo.content),
    });
  }, [shouldSplitMemoWord]);

  const handleShowMemoStoryDialog = () => {
    showMemoStoryDialog(memo.id);
  };

  const markThisMemo = useCallback(() => {
    globalStateService.setMarkMemoId(memo.id);
  }, [memo]);

  const handleBtnsContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (showMoreActionBtns) {
      toggleMoreActionBtns(false);
    }
  }, []);

  const handleDeleteMemoClick = useCallback(async () => {
    if (showConfirmDeleteBtn) {
      await props.delete(props.index);
    } else {
      toggleConfirmDeleteBtn();
    }
  }, [showConfirmDeleteBtn]);

  const handlerShowMoreBtnsClick = useCallback(async () => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn(false);
    }
    toggleMoreActionBtns();
  }, [showConfirmDeleteBtn]);

  const handleEditMemoClick = useCallback(() => {
    globalStateService.setEditMemoId(memo.id);
  }, [memo]);

  const handleMouseLeaveMemoWrapper = useCallback(() => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn(false);
    }
    if (showMoreActionBtns) {
      toggleMoreActionBtns(false);
    }
  }, [showConfirmDeleteBtn, showMoreActionBtns]);

  const handleGenMemoImageBtnClick = useCallback(() => {
    showGenMemoImageDialog(memo);
  }, [memo]);

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === "memo-link-text") {
      const memoId = targetEl.dataset?.value;

      if (memoId) {
        const memoTemp = memoService.getMemoById(memoId) ?? (await api.getMemoById(memoId)).data;

        if (memoTemp) {
          showMemoStoryDialog(memoId);
        }
      }
    }
  };

  return (
    <div className={"memo-wrapper " + className} onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text" onClick={handleShowMemoStoryDialog}>
          {memo.createdAtStr}
        </span>
        <div className="btns-container" onClick={handleBtnsContainerClick}>
          <span className="text-btn mark-btn" onClick={markThisMemo}>
            Mark
          </span>
          <div className={"more-action-btns-container " + (showMoreActionBtns ? "" : "hidden")}>
            <span className="text-btn" onClick={handleGenMemoImageBtnClick}>
              分享
            </span>
            <span className="text-btn" onClick={handleEditMemoClick}>
              编辑
            </span>
            {/* Memo 删除相关按钮 */}
            <span className="text-btn delete-btn" onClick={handleDeleteMemoClick}>
              {showConfirmDeleteBtn ? "确定删除" : "删除"}
            </span>
          </div>
          <span className={"text-btn more-action-btns " + (showMoreActionBtns ? "active" : "")} onClick={handlerShowMoreBtnsClick}>
            ···
          </span>
        </div>
      </div>
      <div className="memo-content-text" onClick={handleMemoContentClick} dangerouslySetInnerHTML={{ __html: memo.formattedContent }}></div>
      {imageUrls.length > 0 ? (
        <div className="images-container">
          {imageUrls.map((imgUrl, idx) => (
            <Image className="memo-img" key={idx} imgUrl={imgUrl} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export function formatMemoContent(content: string): string {
  content = content.replace(/&nbsp;/g, " ");

  if (storage.preferences.shouldUseMarkdownParser) {
    content = marked(content);
  }

  // 中英文之间加空格，这里只是简单的用正则分开了，可优化
  if (storage.preferences.shouldSplitMemoWord) {
    content = content.replace(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;\[\]\(\)]+)([\u4e00-\u9fa5]?)/g, "$1 $2 $3");
  }

  content = content
    .split("\n")
    .map((t, idx, arr) => {
      if (t !== "") {
        t = t
          .replace(TAG_REG, "<span class='tag-span'>#$1#</span>")
          .replace(LINK_REG, "<a class='link' target='_blank' rel='noreferrer' href='$1'>$1</a>")
          .replace(MEMO_LINK_REG, "<span class='memo-link-text' data-value='$2'>$1</span>");
        return "<p>" + t + "<p>";
      } else if (idx + 1 !== arr.length) {
        return "<br />";
      } else {
        return "";
      }
    })
    .join("");

  return content;
}

export default Memo;
