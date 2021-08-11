import React, { useState, useEffect } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import { memoService } from "../services";
import { showDialog } from "./Dialog";
import showGenMemoImageDialog from "./GenMemoImageDialog";
import { formatMemoContent } from "./Memo";
import Image from "./Image";
import "../less/memo-story-dialog.less";

// memo 关联正则
const MEMO_LINK_REG = /\[@(.+?)\]\((.+?)\)/g;
// 图片路由正则
const IMAGE_URL_REG = /(https?:\/\/[^\s<\\*>']+\.(jpeg|jpg|gif|png|svg))/g;

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
      let memoTemp = memoService.getMemoById(currentMemoId);

      if (!memoTemp) {
        memoTemp = await getMemoById(currentMemoId);
      }

      if (memoTemp) {
        setImageUrls(Array.from(memoTemp.content.match(IMAGE_URL_REG) ?? []));
        setMemo({
          ...memoTemp,
          formattedContent: formatMemoContent(memoTemp.content),
          createdAtStr: utils.getTimeString(memoTemp.createdAt),
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
          const memoTemp = memoService.getMemoById(memoId) ?? (await getMemoById(memoId));

          if (memoTemp) {
            downMemoList.push({
              ...memoTemp,
              formattedContent: formatMemoContent(memoTemp.content),
              createdAtStr: utils.getTimeString(memoTemp.createdAt),
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
      showGenMemoImageDialog(memo as Model.Memo);
    }
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
          {imageUrls.length > 0 ? (
            <div className="images-wrapper">
              {imageUrls.map((imgUrl, idx) => (
                <Image className="memo-img" key={idx} imgUrl={imgUrl} />
              ))}
            </div>
          ) : null}
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

export default function showMemoStoryDialog(memoId: string) {
  showDialog(
    {
      className: "memo-story-dialog",
    },
    MemoStoryDialog,
    { memoId }
  );
}
