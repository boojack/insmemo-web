import React, { useCallback, useEffect, useState } from "react";
import { IMAGE_URL_REG, LINK_REG, TAG_REG } from "../helpers/consts";
import marked from "../helpers/marked";
import globalStateService from "../helpers/globalStateService";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import Image from "./Image";
import showMemoStoryDialog from "./MemoStoryDialog";
import showGenMemoImageDialog from "./GenMemoImageDialog";
import { preferences } from "./PreferencesDialog";
import "../less/memo.less";
import JigsawIcon from "../assets/icons/jigsaw.svg";

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
      formattedContent: formatMemoContent(memo.content),
    });
  }, [shouldSplitMemoWord]);

  const handleMemoClick = useCallback(
    (e: React.MouseEvent) => {
      if (["A", "IMG"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      showMemoStoryDialog(memo.id);
    },
    [memo]
  );

  const uponThisMemo = useCallback(() => {
    globalStateService.setUponMemoId(memo.id);
  }, [memo]);

  const handleBtnsContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleDeleteMemoClick = useCallback(async () => {
    if (showConfirmDeleteBtn) {
      await props.delete(props.index);
    } else {
      toggleConfirmDeleteBtn();
    }
  }, [showConfirmDeleteBtn]);

  const handleEditMemoClick = useCallback(() => {
    globalStateService.setEditMemoId(memo.id);
  }, [memo]);

  const handleMouseLeaveMemoWrapper = useCallback(() => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn();
    }
    if (showMoreActionBtns) {
      toggleMoreActionBtns();
    }
  }, [showConfirmDeleteBtn, showMoreActionBtns]);

  const handleGenMemoImageBtnClick = useCallback(() => {
    showGenMemoImageDialog(memo);
  }, [memo]);

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
      <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formattedContent }}></div>
      {imageUrls.length > 0 ? (
        <div className="images-container">
          {imageUrls.map((imgUrl, idx) => (
            <Image className="memo-img" key={idx} imgUrl={imgUrl} />
          ))}
        </div>
      ) : null}
      {memo.uponMemoId ? (
        <div className="uponmemo-container">
          <img className="icon-img" src={JigsawIcon} />
          <div className="uponmemo-content-text" dangerouslySetInnerHTML={{ __html: uponMemoContent ?? "" }}></div>
        </div>
      ) : null}
    </div>
  );
};

export function formatMemoContent(content: string): string {
  content = content.replace(/&nbsp;/g, " ");

  if (preferences.shouldUseMarkdownParser) {
    content = marked(content);
  }

  // 中英文之间加空格，这里只是简单的用正则分开了，可优化
  if (preferences.shouldSplitMemoWord) {
    content = content.replace(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;\[\]\(\)]+)([\u4e00-\u9fa5]?)/g, "$1 $2 $3");
  }

  content = content
    .split("\n")
    .map((t) => "<p>" + t + "<p>")
    .join("");

  content = content.replace(TAG_REG, "<span class='tag-span'>#$1#</span>");
  content = content.replace(LINK_REG, "<a target='_blank' rel='noreferrer' href='$1'>$1</a>");

  return content;
}

export default Memo;
