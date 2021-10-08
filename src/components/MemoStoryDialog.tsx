import React, { useState, useEffect } from "react";
import { IMAGE_URL_REG, MEMO_LINK_REG } from "../helpers/consts";
import { utils } from "../helpers/utils";
import { memoService } from "../services";
import { showDialog } from "./Dialog";
import showShareMemoImageDialog from "./ShareMemoImageDialog";
import Only from "./common/OnlyWhen";
import { formatMemoContent } from "./Memo";
import Image from "./Image";
import "../less/memo-story-dialog.less";

interface Props extends DialogProps {
  memoId: string;
}

const MemoStoryDialog: React.FC<Props> = (props) => {
  const { memoId: currentMemoId, destroy } = props;
  const [memo, setMemo] = useState<FormattedMemo>();
  const [downMemos, setDownMemos] = useState<FormattedMemo[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchMemo = async () => {
      const memoTemp = await memoService.getMemoById(currentMemoId);

      if (memoTemp) {
        setImageUrls(Array.from(memoTemp.content.match(IMAGE_URL_REG) ?? []));
        setMemo({
          ...memoTemp,
          formattedContent: formatMemoContent(memoTemp.content),
          createdAtStr: utils.getDateTimeString(memoTemp.createdAt),
        });
      }
    };

    fetchMemo();
  }, []);

  useEffect(() => {
    const fetchDownMemos = async () => {
      if (!memo) {
        return;
      }

      const downMemoList: FormattedMemo[] = [];
      const matchedArr = [...memo.content.matchAll(MEMO_LINK_REG)];
      for (const matchRes of matchedArr) {
        if (matchRes && matchRes.length === 3) {
          const memoId = matchRes[2];
          const memoTemp = await memoService.getMemoById(memoId);

          if (memoTemp) {
            downMemoList.push({
              ...memoTemp,
              formattedContent: formatMemoContent(memoTemp.content),
              createdAtStr: utils.getDateTimeString(memoTemp.createdAt),
            });
            setDownMemos([...downMemoList]);
          }
        }
      }
    };

    fetchDownMemos();
  }, [memo]);

  const handleGenMemoImageBtnClick = () => {
    if (memo) {
      showShareMemoImageDialog(memo as Model.Memo);
    }
  };

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === "memo-link-text") {
      const memoId = targetEl.dataset?.value;

      if (memoId) {
        const memoTemp = await memoService.getMemoById(memoId);

        if (memoTemp) {
          destroy();
          showMemoStoryDialog(memoId);
        }
      }
    }
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">📕</span>Memo Story
        </p>
        <button className="text-btn close-btn" onClick={destroy}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <div className="memo-container current">
          <div className="memo-header-container">
            <p className="time-text">{memo?.createdAtStr}</p>
            <span className="action-btn" onClick={handleGenMemoImageBtnClick}>
              Share
            </span>
          </div>
          <div
            className="memo-content-text"
            onClick={handleMemoContentClick}
            dangerouslySetInnerHTML={{ __html: memo?.formattedContent ?? "" }}
          ></div>
          <Only when={imageUrls.length > 0}>
            <div className="images-wrapper">
              {imageUrls.map((imgUrl, idx) => (
                <Image className="memo-img" key={idx} imgUrl={imgUrl} />
              ))}
            </div>
          </Only>
        </div>
        <p className={"normal-text " + (downMemos.length === 0 ? "hidden" : "")}>链接了 {downMemos.length} 个 Memo</p>
        <div className={"down-memos-wrapper " + (downMemos.length !== 0 ? "" : "hidden")}>
          {downMemos.map((m) => (
            <div className="memo-container" key={m.id}>
              <div className="memo-header-container">
                <p className="time-text">{m.createdAtStr}</p>
              </div>
              <div
                className="memo-content-text"
                onClick={handleMemoContentClick}
                dangerouslySetInnerHTML={{ __html: m.formattedContent }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default function showMemoStoryDialog(memoId: string): void {
  showDialog(
    {
      className: "memo-story-dialog",
    },
    MemoStoryDialog,
    { memoId }
  );
}
