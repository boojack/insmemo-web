import React from "react";
import { api } from "../helpers/api";
import { storage } from "../helpers/storage";
import { parseMarkedToHtml } from "../helpers/marked";
import { globalStateService, memoService } from "../services";
import { utils } from "../helpers/utils";
import useToggle from "../hooks/useToggle";
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
  index: number;
  memo: Model.Memo;
}

const Memo: React.FC<Props> = (props: Props) => {
  const { memo: propsMemo } = props;
  const memo: FormattedMemo = {
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  };
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  const handleShowMemoStoryDialog = () => {
    showMemoStoryDialog(memo.id);
  };

  const markThisMemo = () => {
    globalStateService.setMarkMemoId(memo.id);
  };

  const handleDeleteMemoClick = async () => {
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
  };

  const handleEditMemoClick = () => {
    globalStateService.setEditMemoId(memo.id);
  };

  const handleMouseLeaveMemoWrapper = () => {
    if (showConfirmDeleteBtn) {
      toggleConfirmDeleteBtn(false);
    }
  };

  const handleGenMemoImageBtnClick = () => {
    showGenMemoImageDialog(memo);
  };

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
    <div className={`memo-wrapper ${props.className}`} onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text" onClick={handleShowMemoStoryDialog}>
          {memo.createdAtStr}
        </span>
        <div className="btns-container">
          <span className="text-btn more-action-btn"></span>
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
  const tempDivContainer = document.createElement("div");
  tempDivContainer.innerHTML = content;
  const tempFirstPElement = document.createElement("p");

  while (tempDivContainer.firstChild && tempDivContainer.firstChild.nodeName !== "P") {
    const node = tempDivContainer.firstChild;
    if (node.nodeName === "#text") {
      tempFirstPElement.innerHTML += node.nodeValue;
    } else {
      tempFirstPElement.innerHTML += (node as Element).outerHTML;
    }
    node.remove();
  }

  if (tempFirstPElement.innerHTML !== "") {
    tempDivContainer.prepend(tempFirstPElement);
    content = tempDivContainer.innerHTML;
  }

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

  content = content
    .replace(TAG_REG, "<span class='tag-span'>#$1#</span>")
    .replace(LINK_REG, "<a class='link' target='_blank' rel='noreferrer' href='$1'>$1</a>")
    .replace(MEMO_LINK_REG, "<span class='memo-link-text' data-value='$2'>$1</span>");

  return content;
}

export default Memo;
