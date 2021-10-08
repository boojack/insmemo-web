import React from "react";
import { IMAGE_URL_REG, LINK_REG, MEMO_LINK_REG, TAG_REG } from "../helpers/consts";
import { parseMarkedToHtml, parseRawTextToHtml } from "../helpers/marked";
import { utils } from "../helpers/utils";
import useToggle from "../hooks/useToggle";
import { globalStateService, memoService } from "../services";
import Only from "./common/OnlyWhen";
import Image from "./Image";
import showDailyMemoDiaryDialog from "./DailyMemoDiaryDialog";
import showMemoStoryDialog from "./MemoStoryDialog";
import showGenMemoImageDialog from "./GenMemoImageDialog";
import toastHelper from "./Toast";
import "../less/memo.less";

interface Props {
  memo: Model.Memo;
}

const Memo: React.FC<Props> = (props: Props) => {
  const { memo: propsMemo } = props;
  const memo: FormattedMemo = {
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  const handleShowMemoStoryDialog = () => {
    showDailyMemoDiaryDialog(utils.getTimeStampByDate(memo.createdAt));
  };

  const handleMarkMemoClick = () => {
    globalStateService.setMarkMemoId(memo.id);
  };

  const handleEditMemoClick = () => {
    globalStateService.setEditMemoId(memo.id);
  };

  const handleDeleteMemoClick = async () => {
    if (showConfirmDeleteBtn) {
      try {
        await memoService.deleteMemoById(memo.id);
        await memoService.fetchMoreMemos();
      } catch (error: any) {
        toastHelper.error(error.message);
      }

      if (globalStateService.getState().editMemoId === memo.id) {
        globalStateService.setEditMemoId("");
      }
    } else {
      toggleConfirmDeleteBtn();
    }
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
        const memoTemp = await memoService.getMemoById(memoId);

        if (memoTemp) {
          showMemoStoryDialog(memoId);
        }
      }
    }
  };

  return (
    <div className="memo-wrapper" onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text" onClick={handleShowMemoStoryDialog}>
          {memo.createdAtStr}
        </span>
        <div className="btns-container">
          <span className="text-btn more-action-btn"></span>
          <div className="more-action-btns-wrapper">
            <div className="more-action-btns-container">
              <span className="text-btn" onClick={handleMarkMemoClick}>
                Mark
              </span>
              <span className="text-btn" onClick={handleGenMemoImageBtnClick}>
                分享
              </span>
              <span className="text-btn" onClick={handleEditMemoClick}>
                编辑
              </span>
              <span className="text-btn delete-btn" onClick={handleDeleteMemoClick}>
                {showConfirmDeleteBtn ? "确定删除！" : "删除"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="memo-content-text" onClick={handleMemoContentClick} dangerouslySetInnerHTML={{ __html: memo.formattedContent }}></div>
      <Only when={imageUrls.length > 0}>
        <div className="images-wrapper">
          {imageUrls.map((imgUrl, idx) => (
            <Image className="memo-img" key={idx} imgUrl={imgUrl} />
          ))}
        </div>
      </Only>
    </div>
  );
};

export function formatMemoContent(content: string): string {
  const tempDivContainer = document.createElement("div");
  tempDivContainer.innerHTML = parseRawTextToHtml(content)
    .split(/<br>/)
    .map((t) => {
      if (t !== "") {
        return `<p>${t}</p>`;
      } else {
        return "";
      }
    })
    .join("");
  content = tempDivContainer.innerHTML;

  const { shouldUseMarkdownParser, shouldSplitMemoWord, shouldHideImageUrl } = globalStateService.getState();

  if (shouldUseMarkdownParser) {
    content = parseMarkedToHtml(content);
  }

  // 中英文之间加空格（这里只是简单的用正则分开了）
  if (shouldSplitMemoWord) {
    content = content.replace(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;[\]]+)([\u4e00-\u9fa5]?)/g, "$1 $2 $3");
  }

  if (shouldHideImageUrl) {
    content = content.replace(IMAGE_URL_REG, "");
  }

  // 清除空行: <p></p>
  tempDivContainer.innerHTML = content;
  for (const p of tempDivContainer.querySelectorAll("p")) {
    if (p.textContent === "" && p.firstElementChild?.tagName !== "BR") {
      p.remove();
    }
  }
  content = tempDivContainer.innerHTML;

  content = content
    .replace(TAG_REG, "<span class='tag-span'>#$1</span>")
    .replace(LINK_REG, "<a class='link' target='_blank' rel='noreferrer' href='$1'>$1</a>")
    .replace(MEMO_LINK_REG, "<span class='memo-link-text' data-value='$2'>$1</span>");

  return content;
}

export default React.memo(Memo);
