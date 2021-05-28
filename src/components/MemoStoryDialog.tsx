import React, { useState, useEffect } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import { memoService } from "../helpers/memoService";
import { showDialog } from "./Dialog";
import { formatMemoContent } from "./Memo";
import "../less/memo-story-dialog.less";

interface Props extends DialogProps {
  memoId: string;
}

const MemoStoryDialog: React.FunctionComponent<Props> = (props) => {
  const { memoId: currentMemoId } = props;
  const [currentMemo, setCurrentMemo] = useState<FormatedMemo>();
  const [downMemos, setDownMemos] = useState<FormatedMemo[]>([]);
  const [showDownMemosContainer, toggleDownMemosStatus] = useToggle(false);

  useEffect(() => {
    const fetchMemos = async () => {
      const memoTemp = memoService.getMemoById(currentMemoId) as Model.Memo;
      setCurrentMemo({
        ...memoTemp,
        formatedContent: formatMemoContent(memoTemp.content),
        createdAtStr: utils.getTimeString(memoTemp.createdAt),
      });

      const downMemoIdList: string[] = [];
      const downMemoList: FormatedMemo[] = [];

      if (memoTemp.uponMemoId) {
        downMemoIdList.push(memoTemp.uponMemoId);

        while (downMemoIdList.length > 0) {
          const memoId = downMemoIdList.shift();

          if (memoId) {
            const memoTemp = memoService.getMemoById(memoId) ?? (await api.getMemoById(memoId)).data;

            if (memoTemp) {
              downMemoList.push({
                ...memoTemp,
                formatedContent: formatMemoContent(memoTemp.content),
                createdAtStr: utils.getTimeString(memoTemp.createdAt),
              });

              if (memoTemp.uponMemoId) {
                downMemoIdList.push(memoTemp.uponMemoId);
                setDownMemos([...downMemoList]);
              }
            }
          }
        }
      }
    };

    fetchMemos();
  }, [currentMemoId]);

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">📚</span>Memo Story
        </p>
        <button className="text-btn close-btn" onClick={props.destory}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        {currentMemo ? (
          <>
            <div className="memo-container current" key={currentMemo.id}>
              <p className="time-text">{currentMemo.createdAtStr}</p>
              <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: currentMemo.formatedContent }}></div>
            </div>
            <p className={"action-text " + (downMemos.length === 0 ? "hidden" : "")} onClick={toggleDownMemosStatus}>
              下面有 {downMemos.length} 个 Memo，点击{showDownMemosContainer ? "收起" : "展开"}
            </p>
          </>
        ) : null}
        <div className={"down-memos-wrapper " + (downMemos.length !== 0 && showDownMemosContainer ? "" : "hidden")}>
          {downMemos.map((m) => (
            <div className={"memo-container " + (m.id === currentMemoId ? "current" : "")} key={m.id}>
              <p className="time-text">{m.createdAtStr}</p>
              <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: m.formatedContent }}></div>
            </div>
          ))}
        </div>
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
