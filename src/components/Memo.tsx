import React, { useCallback, useEffect, useState } from "react";
import { api } from "../helpers/api";
import { storage } from "../helpers/storage";
import { parseMarkedToHtml } from "../helpers/marked";
import memoService from "../helpers/memoService";
import globalStateService from "../helpers/globalStateService";
import { utils } from "../helpers/utils";
import useToggle from "../hooks/useToggle";
import Image from "./Image";
import showMemoStoryDialog from "./MemoStoryDialog";
import showGenMemoImageDialog from "./GenMemoImageDialog";
import MoreIcon from "../assets/icons/more.svg";
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
  memo: Model.Memo;
  index: number;
  additionClassName: string;
}

const Memo: React.FC<Props> = (props: Props) => {
  const { memo: propsMemo } = props;
  const [memo, setMemo] = useState<FormattedMemo>({
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  });
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  useEffect(() => {
    setMemo({
      ...memo,
      formattedContent: formatMemoContent(memo.content),
    });
  }, []);

  const handleShowMemoStoryDialog = () => {
    showMemoStoryDialog(memo.id);
  };

  const markThisMemo = useCallback(() => {
    globalStateService.setMarkMemoId(memo.id);
  }, [memo]);

  const handleDeleteMemoClick = useCallback(async () => {
    if (showConfirmDeleteBtn) {
      await memoService.deleteMemoById(memo.id);

      if (props.index + 5 > memoService.getState().memos.length) {
        await memoService.fetchMoreMemos();
      }

      if (globalStateService.getState().editMemoId === memo.id) {
        globalStateService.setEditMemoId("");
      }
    } else {
      toggleConfirmDeleteBtn();
    }
  }, [showConfirmDeleteBtn]);

  const handleEditMemoClick = useCallback(() => {
    globalStateService.setEditMemoId(memo.id);
  }, [memo]);

  const handleMouseLeaveMemoWrapper = useCallback(() => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn(false);
    }
  }, [showConfirmDeleteBtn]);

  const handleGenMemoImageBtnClick = useCallback(() => {
    showGenMemoImageDialog(memo);
  }, [memo]);

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === "memo-link-text") {
      const memoId = targetEl.dataset?.value;

      if (memoId) {
        let memoTemp = memoService.getMemoById(memoId);

        if (!memoTemp) {
          memoTemp = await getMemoById(memoId);
          const t = setInterval(async () => {
            if (!memoService.getMemoById(memoId)) {
              await memoService.fetchMoreMemos();
            } else {
              clearInterval(t);
            }
          }, 0);
        }

        if (memoTemp) {
          showMemoStoryDialog(memoId);
        }
      }
    }
  };

  return (
    <div className={"memo-wrapper " + props.additionClassName} onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text" onClick={handleShowMemoStoryDialog}>
          {memo.createdAtStr}
        </span>
        <div className="btns-container">
          <span className="text-btn more-action-btn">
            <img className="img-icon" src={MoreIcon} />
          </span>
          <div className="more-action-btns-wrapper">
            <div className="more-action-btns-container">
              <span className="text-btn" onClick={markThisMemo}>
                Mark
              </span>
              <span className="text-btn" onClick={handleGenMemoImageBtnClick}>
                分享
              </span>
              <span className="text-btn" onClick={handleEditMemoClick}>
                编辑
              </span>
              {/* Memo 删除相关按钮 */}
              <span className="text-btn delete-btn" onClick={handleDeleteMemoClick}>
                {showConfirmDeleteBtn ? "确定删除！" : "删除"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="memo-content-text" onClick={handleMemoContentClick} dangerouslySetInnerHTML={{ __html: memo.formattedContent }}></div>
      {imageUrls.length > 0 ? (
        <div className="images-wrapper">
          {imageUrls.map((imgUrl, idx) => (
            <Image className="memo-img" key={idx} imgUrl={imgUrl} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

function getMemoById(memoId: string): Promise<Model.Memo> {
  return new Promise((resolve, reject) => {
    api
      .getMemoById(memoId)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        // do nth
      });
  });
}

export function formatMemoContent(content: string): string {
  const { shouldUseMarkdownParser, shouldSplitMemoWord, shouldHideImageUrl } = storage.preferences;

  if (shouldUseMarkdownParser) {
    content = parseMarkedToHtml(content);
  }

  // 中英文之间加空格，这里只是简单的用正则分开了，可优化
  if (shouldSplitMemoWord) {
    content = content.replace(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;\[\]\(\)]+)([\u4e00-\u9fa5]?)/g, "$1 $2 $3");
  }

  if (shouldHideImageUrl) {
    content = content.replace(IMAGE_URL_REG, "");
  }

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;
  const tempP = document.createElement("p");

  while (tempDiv.firstChild && (tempDiv.firstChild.nodeName === "#text" || tempDiv.firstChild.nodeName === "BR")) {
    const node = tempDiv.firstChild;
    if (node.nodeName === "#text") {
      tempP.innerHTML += node.nodeValue;
    } else {
      tempP.innerHTML += "<br>";
    }
    node.remove();
  }

  if (tempP.innerHTML !== "") {
    tempDiv.prepend(tempP);
    content = tempDiv.innerHTML;
  }

  content = content
    .replace(TAG_REG, "<span class='tag-span'>#$1#</span>")
    .replace(LINK_REG, "<a class='link' target='_blank' rel='noreferrer' href='$1'>$1</a>")
    .replace(MEMO_LINK_REG, "<span class='memo-link-text' data-value='$2'>$1</span>");

  return content;
}

export default Memo;
