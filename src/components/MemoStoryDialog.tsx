import React, { useState, useEffect } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import memoService from "../helpers/memoService";
import { showDialog } from "./Dialog";
import { showGenMemoImageDialog } from "./GenMemoImageDialog";
import { formatMemoContent } from "./Memo";
import "../less/memo-story-dialog.less";

interface Props extends DialogProps {
  memoId: string;
}

const MemoStoryDialog: React.FunctionComponent<Props> = (props) => {
  const { memoId: currentMemoId } = props;
  const [currentMemo, setCurrentMemo] = useState<FormattedMemo>();
  const [downMemos, setDownMemos] = useState<FormattedMemo[]>([]);
  const [showDownMemosContainer, toggleDownMemosStatus] = useToggle(false);

  useEffect(() => {
    const memoTemp = memoService.getMemoById(currentMemoId);

    if (memoTemp) {
      setCurrentMemo({
        ...memoTemp,
        formattedContent: formatMemoContent(memoTemp.content),
        createdAtStr: utils.getTimeString(memoTemp.createdAt),
      });
    }
  }, []);

  useEffect(() => {
    const fetchDownMemos = async () => {
      if (!currentMemo || !currentMemo.uponMemoId) {
        return;
      }

      const downMemoIdList: string[] = [currentMemo.uponMemoId];
      const downMemoList: FormattedMemo[] = [];

      while (downMemoIdList.length > 0) {
        const memoId = downMemoIdList.shift();

        if (memoId) {
          const memoTemp = memoService.getMemoById(memoId) ?? (await api.getMemoById(memoId)).data;

          if (memoTemp) {
            downMemoList.push({
              ...memoTemp,
              formattedContent: formatMemoContent(memoTemp.content),
              createdAtStr: utils.getTimeString(memoTemp.createdAt),
            });
            setDownMemos([...downMemoList]);

            if (memoTemp.uponMemoId) {
              downMemoIdList.push(memoTemp.uponMemoId);
            }
          }
        }
      }
    };

    fetchDownMemos();
  }, [currentMemo]);

  const handleGenMemoImageBtnClick = () => {
    if (currentMemo) {
      showGenMemoImageDialog(currentMemo as Model.Memo);
    }
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">📚</span>Memo Story
        </p>
        <button className="text-btn close-btn" onClick={props.destroy}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <p className="tip-text">This is the hidden feature called "Memo Story Dialog" and waiting for continue. </p>
        {currentMemo ? (
          <>
            <div className="memo-container current" key={currentMemo.id}>
              <div className="memo-header-container">
                <p className="time-text">{currentMemo.createdAtStr}</p>
                <span className="action-btn" onClick={handleGenMemoImageBtnClick}>
                  Share
                </span>
              </div>
              <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: currentMemo.formattedContent }}></div>
            </div>
            <p className={"action-text " + (downMemos.length === 0 ? "hidden" : "")} onClick={toggleDownMemosStatus}>
              下游有 {downMemos.length} 个 Memo，点击{showDownMemosContainer ? "收起" : "展开"}
            </p>
          </>
        ) : null}
        <div className={"down-memos-wrapper " + (downMemos.length !== 0 && showDownMemosContainer ? "" : "hidden")}>
          {downMemos.map((m) => (
            <div className={"memo-container " + (m.id === currentMemoId ? "current" : "")} key={m.id}>
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

export function showMemoStoryDialog(memoId: string) {
  showDialog(
    {
      className: "memo-story-dialog",
    },
    MemoStoryDialog,
    { memoId }
  );
}
