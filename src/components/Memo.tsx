import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { LINK_REG } from "../helpers/consts";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import { stateManager } from "../helpers/stateManager";
import { ImageX } from "./ImageX";
import { showMemoStoryDialog } from "./MemoStoryDialog";
import { showGenMemoImageDialog } from "./GenMemoImageDialog";
import { preferences } from "./PreferencesDialog";
import MagnetIcon from "../assets/icons/magnet.svg";
import "../less/memo.less";

interface Props {
  className: string;
  memo: Model.Memo;
  index: number;
  shouldSplitMemoWord: boolean;
  delete: (idx: number) => Promise<void>;
}

export interface MemoItem extends Model.Memo {
  formatedContent: string;
  createdAtStr: string;
}

export const Memo: React.FunctionComponent<Props> = (props: Props) => {
  const { className, memo: propsMemo, shouldSplitMemoWord } = props;
  const [memo, setMemo] = useState<MemoItem>({
    ...propsMemo,
    formatedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  });
  const [uponMemo, setUponMemo] = useState<MemoItem>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
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
          formatedContent: utils.parseHTMLToRawString(formatMemoContent(uponMemoData.content)),
          createdAtStr: utils.getTimeString(uponMemoData.createdAt),
        });
      }
    }

    const parseImageUrls = async () => {
      const links = memo.content.match(LINK_REG);

      if (links) {
        const urls: string[] = [];

        for (const link of links) {
          const { data } = await api.getUrlContentType(link);

          if (data.includes("image")) {
            urls.push(link);
            setImageUrls([...urls]);
          }
        }
      }
    };

    parseImageUrls();
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

  const handleGenMemoImageBtnClick = () => {
    showGenMemoImageDialog(memo);
  };

  return (
    <div className={"memo-wrapper " + className} onMouseLeave={handleMouseLeaveMemoWrapper}>
      <div className="memo-top-wrapper">
        <span className="time-text">{memo.createdAtStr}</span>
        <div className="btns-container">
          {uponMemo ? (
            <span className="text-btn" onClick={showStoryDialog}>
              All
            </span>
          ) : null}
          <span className={"text-btn " + (showEditActionBtn ? "hidden" : "")} onClick={uponThisMemo}>
            Mark
          </span>
          {showMoreActionBtns ? (
            <>
              <span className={"text-btn " + (showEditActionBtn ? "hidden" : "")} onClick={handleGenMemoImageBtnClick}>
                分享
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
      {imageUrls.length > 0 ? (
        <div className="images-container">
          {imageUrls.map((imgUrl, idx) => (
            <ImageX className="memo-img" key={idx} imgUrl={imgUrl} />
          ))}
        </div>
      ) : null}
      {uponMemo ? (
        <div className="uponmemo-container">
          <img src={MagnetIcon} className="icon-img" />
          <div className="uponmemo-content-text" dangerouslySetInnerHTML={{ __html: uponMemo.formatedContent }}></div>
        </div>
      ) : null}
    </div>
  );
};

export function formatMemoContent(content: string): string {
  const tagReg = /#(.+?)#/g;

  content = content.replaceAll("\n", "<br>");
  content = content.replaceAll(tagReg, "<span class='tag-span'>#$1</span>");
  content = content.replaceAll(LINK_REG, "<a target='_blank' href='$1'>$1</a>");

  // 中英文之间加空格，这里只是简单的用正则分开了，可优化
  if (preferences.shouldSplitMemoWord) {
    content = content.replaceAll(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;\[\]\(\)]+)([\u4e00-\u9fa5]?)/g, "$1 $2 $3");
  }

  return content;
}
