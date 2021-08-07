import React, { useEffect, useRef, useState } from "react";
import { storage } from "../helpers/storage";
import { utils } from "../helpers/utils";
import { DAILY_TIMESTAMP } from "../helpers/consts";
import memoService from "../helpers/memoService";
import { showDialog } from "./Dialog";
import showPreviewImageDialog from "./PreviewImageDialog";
import DailyMemo from "./DailyMemo";
import "../less/daily-memo-diary-dialog.less";

interface Props extends DialogProps {
  currentTimeStamp: TimeStamp;
}

const monthChineseStrArray = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const weekdayChineseStrArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const DailyMemoDiaryDialog: React.FC<Props> = (props: Props) => {
  const [isLoading, setLoadingStatus] = useState<boolean>(true);
  const [memos, setMemos] = useState<Model.Memo[]>([]);
  const [currentDateTimeStamp, setCurrentDateTimeStamp] = useState(utils.getTimeStampByDate(utils.getDateString(props.currentTimeStamp)));
  const memosElRef = useRef(null);
  const currentDate = new Date(currentDateTimeStamp);

  useEffect(() => {
    const getDailyMemos = () => {
      setLoadingStatus(true);
      const memos = memoService.getState().memos;
      const lastMemo = memos.slice(-1).pop();
      if (lastMemo && lastMemo.createdAt >= currentDateTimeStamp) {
        memoService.fetchMoreMemos();
      } else {
        const dailyMemos = memos
          .filter((a) => a.createdAt >= currentDateTimeStamp && a.createdAt < currentDateTimeStamp + DAILY_TIMESTAMP)
          .sort((a, b) => a.createdAt - b.createdAt);
        setMemos(dailyMemos);
        setLoadingStatus(false);
      }
    };

    getDailyMemos();

    const unsubscribeMemoService = memoService.subscribe(() => {
      getDailyMemos();
    });

    return () => {
      unsubscribeMemoService();
    };
  }, [currentDateTimeStamp]);

  const handleShareBtnClick = () => {
    const osVersion = utils.getOSVersion();
    if (osVersion === "MacOS" || osVersion === "Unknown") {
      window.scrollTo(0, 0);
    }

    html2canvas(memosElRef.current!, {
      scale: window.devicePixelRatio * 2,
      allowTaint: true,
      useCORS: true,
      backgroundColor: storage.preferences.showDarkMode ? "#2f3437" : "white",
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
    }).then((canvas) => {
      showPreviewImageDialog(canvas.toDataURL());
    });
  };

  return (
    <>
      <div className="dialog-header-container">
        <div className="btns-wrapper">
          <div className="btns-container">
            <span className="btn-text" onClick={() => setCurrentDateTimeStamp(currentDateTimeStamp - DAILY_TIMESTAMP)}>
              <img className="icon-img" src="/icons/arrow-left.svg" />
            </span>
            <span className="btn-text" onClick={() => setCurrentDateTimeStamp(currentDateTimeStamp + DAILY_TIMESTAMP)}>
              <img className="icon-img" src="/icons/arrow-right.svg" />
            </span>
          </div>
          <div className="btns-container">
            <span className="btn-text" onClick={handleShareBtnClick}>
              <img className="icon-img" src="/icons/share.svg" />
            </span>
            <span className="btn-text" onClick={() => props.destroy()}>
              <img className="icon-img" src="/icons/close.svg" />
            </span>
          </div>
        </div>
      </div>
      <div className="dialog-content-container" ref={memosElRef}>
        <div className="date-card-container">
          <div className="year-text">{currentDate.getFullYear()}</div>
          <div className="date-container">
            <div className="month-text">{monthChineseStrArray[currentDate.getMonth()]}</div>
            <div className="date-text">{currentDate.getDate()}</div>
            <div className="day-text">{weekdayChineseStrArray[currentDate.getDay()]}</div>
          </div>
        </div>
        {isLoading ? null : memos.length === 0 ? (
          <div className="null-container">
            <p className="tip-text">空空如也</p>
          </div>
        ) : (
          <div className="dailymemos-wrapper">
            {memos.map((memo, idx) => {
              const key = memo.id + " " + memo.updatedAt;
              return <DailyMemo key={key} index={idx} memo={memo} />;
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default function showDailyMemoDiaryDialog(timestamp: TimeStamp = Date.now()) {
  showDialog(
    {
      className: "daily-memo-diary-dialog",
    },
    DailyMemoDiaryDialog,
    { currentTimeStamp: timestamp }
  );
}
