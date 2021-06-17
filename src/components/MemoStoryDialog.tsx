import React, { useState, useEffect } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import memoService from "../helpers/memoService";
import { showDialog } from "./Dialog";
import showGenMemoImageDialog from "./GenMemoImageDialog";
import { formatMemoContent } from "./Memo";
import "../less/memo-story-dialog.less";

// memo 关联正则
const MEMO_LINK_REG = /\[@(.+?)\]\((.+?)\)/;

interface Props extends DialogProps {
  memoId: string;
}

const MemoStoryDialog: React.FunctionComponent<Props> = (props) => {
  const { memoId: currentMemoId } = props;
  const [memo, setMemo] = useState<FormattedMemo>();
  const [downMemos, setDownMemos] = useState<FormattedMemo[]>([]);

  useEffect(() => {
    const memoTemp = memoService.getMemoById(currentMemoId);

    if (memoTemp) {
      setMemo({
        ...memoTemp,
        formattedContent: formatMemoContent(memoTemp.content),
        createdAtStr: utils.getTimeString(memoTemp.createdAt),
      });
    }
  }, []);

  useEffect(() => {
    const fetchDownMemos = async () => {
      if (!memo) {
        return;
      }

      const downMemoList: FormattedMemo[] = [];
      memo.content.split("\n").map(async (t) => {
        const matchRes = t.match(MEMO_LINK_REG);

        if (matchRes?.length === 3) {
          const memoId = matchRes[2];
          const memoTemp = memoService.getMemoById(memoId) ?? (await api.getMemoById(memoId)).data;

          if (memoTemp) {
            downMemoList.push({
              ...memoTemp,
              formattedContent: formatMemoContent(memoTemp.content),
              createdAtStr: utils.getTimeString(memoTemp.createdAt),
            });
            setDownMemos([...downMemoList]);
          }
        }
      });
    };
    fetchDownMemos();
  }, [memo]);

  const handleGenMemoImageBtnClick = () => {
    if (memo) {
      showGenMemoImageDialog(memo as Model.Memo);
    }
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">📕</span>Memo Story
        </p>
        <button className="text-btn close-btn" onClick={props.destroy}>
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
          <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo?.formattedContent ?? "" }}></div>
        </div>
        <p className={"normal-text " + (downMemos.length === 0 ? "hidden" : "")}>链接了 {downMemos.length} 个 Memo</p>
        <div className={"down-memos-wrapper " + (downMemos.length !== 0 ? "" : "hidden")}>
          {downMemos.map((m) => (
            <div id={m.id} className="memo-container" key={m.id}>
              <div className="memo-header-container">
                <p className="time-text">{m.createdAtStr}</p>
              </div>
              <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: m.formattedContent }}></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default function showMemoStoryDialog(memoId: string) {
  showDialog(
    {
      className: "memo-story-dialog",
    },
    MemoStoryDialog,
    { memoId }
  );
}
