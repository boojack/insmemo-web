import { memo, useEffect, useRef } from "react";
import { IMAGE_URL_REG, LINK_REG, MEMO_LINK_REG, TAG_REG } from "../helpers/consts";
import { parseMarkedToHtml, parseRawTextToHtml } from "../helpers/marked";
import * as utils from "../helpers/utils";
import useToggle from "../hooks/useToggle";
import { globalStateService, memoService } from "../services";
import Only from "./common/OnlyWhen";
import Image from "./Image";
import showMemoCardDialog from "./MemoCardDialog";
import showShareMemoImageDialog from "./ShareMemoImageDialog";
import toastHelper from "./Toast";
import "../less/memo.less";

interface Props {
  memo: Model.Memo;
}

const Memo: React.FC<Props> = (props: Props) => {
  const { memo: propsMemo } = props;
  const memo: FormattedMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);
  const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  const memoContentElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (memoContentElRef.current) {
      const tempDiv = formatMemoContent(memo.content);
      memoContentElRef.current.append(...tempDiv.children);
    }
  }, []);

  const handleShowMemoStoryDialog = () => {
    showMemoCardDialog(memo);
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
        await memoService.hideMemoById(memo.id);
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
    showShareMemoImageDialog(memo);
  };

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === "memo-link-text") {
      const memoId = targetEl.dataset?.value;
      const memoTemp = memoService.getMemoById(memoId ?? "");

      if (memoTemp) {
        showMemoCardDialog(memoTemp);
      } else {
        toastHelper.error("MEMO Not Found");
        targetEl.classList.remove("memo-link-text");
      }
    } else if (targetEl.className === "todo-block") {
      // do nth
    }
  };

  return (
    <div className={`memo-wrapper ${"memos-" + memo.id}`} onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text" onClick={handleShowMemoStoryDialog}>
          {memo.createdAtStr}
        </span>
        <div className="btns-container">
          <span className="text-btn more-action-btn">
            <img className="icon-img" src="/icons/more.svg" />
          </span>
          <div className="more-action-btns-wrapper">
            <div className="more-action-btns-container">
              <span className="text-btn" onClick={handleShowMemoStoryDialog}>
                查看详情
              </span>
              <span className="text-btn" onClick={handleMarkMemoClick}>
                Mark
              </span>
              <span className="text-btn" onClick={handleGenMemoImageBtnClick}>
                分享
              </span>
              <span className="text-btn" onClick={handleEditMemoClick}>
                编辑
              </span>
              <span className={`text-btn delete-btn ${showConfirmDeleteBtn ? "final-confirm" : ""}`} onClick={handleDeleteMemoClick}>
                {showConfirmDeleteBtn ? "确定删除！" : "删除"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="memo-content-text" ref={memoContentElRef} onClick={handleMemoContentClick}></div>
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

export function formatMemoContent(content: string): Element {
  content = parseRawTextToHtml(content)
    .split("<br>")
    .map((t) => {
      if (t !== "") {
        return `<p>${t}</p>`;
      } else {
        return "<br>";
      }
    })
    .join("");

  const { shouldUseMarkdownParser, shouldSplitMemoWord, shouldHideImageUrl } = globalStateService.getState();

  if (shouldUseMarkdownParser) {
    content = parseMarkedToHtml(content);
  }

  if (shouldHideImageUrl) {
    content = content.replace(IMAGE_URL_REG, "");
  }

  // 中英文之间加空格
  if (shouldSplitMemoWord) {
    content = content
      .replace(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;[\]]+)/g, "$1 $2")
      .replace(/([A-Za-z0-9?.,;[\]]+)([\u4e00-\u9fa5])/g, "$1 $2");
  }

  content = content
    .replace(TAG_REG, "<span class='tag-span'>#$1</span>")
    .replace(LINK_REG, "<a class='link' target='_blank' rel='noreferrer' href='$1'>$1</a>")
    .replace(MEMO_LINK_REG, "<span class='memo-link-text' data-value='$2'>$1</span>");

  const tempDivContainer = document.createElement("div");
  tempDivContainer.innerHTML = content;
  utils.clearDangerHTMLNode(tempDivContainer);

  return tempDivContainer;
}

export default memo(Memo);
