import React, { useEffect, useMemo, useState } from "react";
import memoService from "../helpers/memoService";
import DailyMemo from "./DailyMemo";
import { showDialog } from "./Dialog";
import { utils } from "../helpers/utils";
import { DAILY_TIMESTAMP } from "../helpers/consts";
import "../less/daily-memo-diary-dialog.less";

interface Props extends DialogProps {
  dailyTimeStamp: TimeStamp;
}

const monthChineseStrArray = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const weekdayChineseStrArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const DailyMemoDiaryDialog: React.FC<Props> = (props: Props) => {
  const dailyTimeStamp = useMemo(() => utils.getTimeStampByDate(utils.getDateString(props.dailyTimeStamp)), []);
  const dailyDate = new Date(dailyTimeStamp);

  const [memos, setMemos] = useState<Model.Memo[]>([]);

  useEffect(() => {
    const getDailyMemos = () => {
      const memos = memoService.getState().memos;
      const lastMemo = memos.slice(-1).pop();
      if (lastMemo && lastMemo.createdAt >= dailyTimeStamp) {
        memoService.fetchMoreMemos();
      } else {
        const dailyMemos = memos
          .filter((a) => a.createdAt >= dailyTimeStamp && a.createdAt < dailyTimeStamp + DAILY_TIMESTAMP)
          .sort((a, b) => a.createdAt - b.createdAt);
        setMemos(dailyMemos);
      }
    };

    const unsubscribeMemoService = memoService.subscribe(() => {
      getDailyMemos();
    });

    getDailyMemos();

    return () => {
      unsubscribeMemoService();
    };
  }, []);

  return (
    <>
      <div className="dialog-header-container">
        <div className="year-text">{dailyDate.getFullYear()}</div>
        <div className="daily-date-container">
          <div className="month-text">{monthChineseStrArray[dailyDate.getMonth()]}</div>
          <div className="date-text">{dailyDate.getDate()}</div>
          <div className="day-text">{weekdayChineseStrArray[dailyDate.getDay()]}</div>
        </div>
      </div>
      <div className="dialog-content-container">
        <div className="memolist-wrapper">
          {memos.map((memo, idx) => {
            const key = memo.id + " " + memo.updatedAt;
            return <DailyMemo key={key} index={idx} memo={memo} />;
          })}
        </div>
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
    { dailyTimeStamp: timestamp }
  );
}
