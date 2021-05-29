import React, { useEffect, useState } from "react";
import { IMAGE_URL_REG, LINK_REG, TAG_REG } from "../helpers/consts";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import { stateManager } from "../helpers/stateManager";
import { ImageX } from "./ImageX";
import { showMemoStoryDialog } from "./MemoStoryDialog";
import { showGenMemoImageDialog } from "./GenMemoImageDialog";
import { preferences } from "./PreferencesDialog";
import "../less/memo.less";

interface Props {
  className: string;
  memo: Model.Memo;
  index: number;
  shouldSplitMemoWord: boolean;
  delete: (idx: number) => Promise<void>;
}

export const Memo: React.FunctionComponent<Props> = (props: Props) => {
  const { className, memo: propsMemo, shouldSplitMemoWord } = props;
  const [memo, setMemo] = useState<FormatedMemo>({
    ...propsMemo,
    formatedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  });
  const [uponMemoContent, setUponMemoContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(Array.from(memo.content.match(IMAGE_URL_REG) ?? []));
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const [showMoreActionBtns, toggleMoreActionBtns] = useToggle(false);

  useEffect(() => {
    const { uponMemoId } = memo;

    if (uponMemoId) {
      setUponMemoContent(utils.parseHTMLToRawString(formatMemoContent(memo.uponMemo?.content ?? "")));
    }
  }, [memo]);

  useEffect(() => {
    setMemo({
      ...memo,
      formatedContent: formatMemoContent(memo.content),
    });
  }, [shouldSplitMemoWord]);

  const handleMemoClick = (e: React.MouseEvent) => {
    if (["A", "IMG"].includes((e.target as HTMLElement)?.tagName)) {
      return;
    }

    showMemoStoryDialog(memo.id);
  };

  const uponThisMemo = () => {
    stateManager.setState("uponMemoId", memo.id);
  };

  const handleBtnsContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDeleteMemoClick = async () => {
    if (showConfirmDeleteBtn) {
      await props.delete(props.index);
    } else {
      toggleConfirmDeleteBtn();
    }
  };

  const handleEditMemoClick = () => {
    stateManager.setState("editMemoId", memo.id);
  };

  const handleMouseLeaveMemoWrapper = () => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn();
    }
    if (showMoreActionBtns) {
      toggleMoreActionBtns();
    }
  };

  const handleGenMemoImageBtnClick = () => {
    showGenMemoImageDialog(memo);
  };

  return (
    <div className={"memo-wrapper " + className} onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text" onClick={handleMemoClick}>
          {memo.createdAtStr}
        </span>
        <div className="btns-container" onClick={handleBtnsContainerClick}>
          <span className="text-btn mark-btn" onClick={uponThisMemo}>
            Mark
          </span>
          {showMoreActionBtns ? (
            <>
              <span className="text-btn" onClick={handleGenMemoImageBtnClick}>
                分享
              </span>
              <span className="text-btn" onClick={handleEditMemoClick}>
                编辑
              </span>
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
      <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formatedContent }}></div>
      {imageUrls.length > 0 ? (
        <div className="images-container">
          {imageUrls.map((imgUrl, idx) => (
            <ImageX className="memo-img" key={idx} imgUrl={imgUrl} />
          ))}
        </div>
      ) : null}
      {memo.uponMemoId ? (
        <div className="uponmemo-container">
          <img className="icon-img" src="/icons/magnet.svg" />
          <div className="uponmemo-content-text" dangerouslySetInnerHTML={{ __html: uponMemoContent ?? "" }}></div>
        </div>
      ) : null}
    </div>
  );
};

export function formatMemoContent(content: string): string {
  content = content.replaceAll("\n", "<br>");
  content = content.replaceAll(TAG_REG, "<span class='tag-span'>#$1#</span>");
  content = content.replaceAll(LINK_REG, "<a target='_blank' rel='noreferrer' href='$1'>$1</a>");

  // 中英文之间加空格，这里只是简单的用正则分开了，可优化
  if (preferences.shouldSplitMemoWord) {
    content = content.replaceAll(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;\[\]\(\)]+)([\u4e00-\u9fa5]?)/g, "$1 $2 $3");
  }

  return content;
}
