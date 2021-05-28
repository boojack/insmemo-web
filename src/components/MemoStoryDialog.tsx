import React, { useState, useEffect } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import { showDialog } from "./Dialog";
import { formatMemoContent } from "./Memo";
import "../less/memo-story-dialog.less";

interface Props extends DialogProps {
  memoId: string;
}

const MemoStoryDialog: React.FunctionComponent<Props> = (props) => {
  const [memos, setMemos] = useState<FormatedMemo[]>([]);

  useEffect(() => {
    const fetchMemos = async () => {
      const memoIdList = [props.memoId];
      const memoList: FormatedMemo[] = [];

      while (memoIdList.length > 0) {
        const id = memoIdList.shift();

        if (id) {
          const { data: memo } = await api.getMemoById(id);

          memoList.push({
            ...memo,
            formatedContent: formatMemoContent(memo.content),
            createdAtStr: utils.getTimeString(memo.createdAt),
          });

          if (memo.uponMemoId) {
            memoIdList.push(memo.uponMemoId);
          }
          setMemos([...memoList]);
        }
      }
    };

    fetchMemos();
  }, []);

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">😀</span>有 {memos.length} 个 Memo
        </p>
        <button className="text-btn close-btn" onClick={props.destory}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        {memos.map((m) => (
          <div className="memo-container" key={m.id}>
            <p className="time-text">{m.createdAtStr}</p>
            <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: m.formatedContent }}></div>
          </div>
        ))}
      </div>
    </>
  );
};

export function showMemoStoryDialog(memoId: string) {
  showDialog(
    {
      className: "memo-story-dialog",
    },
    MemoStoryDialog,
    { memoId }
  );
}
