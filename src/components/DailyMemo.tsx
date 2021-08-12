import React, { useEffect, useState } from "react";
import { formatMemoContent } from "./Memo";
import { utils } from "../helpers/utils";
import "../less/daily-memo.less";

interface DailyMemo extends FormattedMemo {
  timeStr: string;
}

interface Props {
  memo: Model.Memo;
  index: number;
}

const DailyMemo: React.FC<Props> = (props: Props) => {
  const { memo: propsMemo } = props;
  const [memo, setMemo] = useState<DailyMemo>({
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
    timeStr: utils.getTimeStampString(propsMemo.createdAt),
  });

  return (
    <div className="daily-memo-wrapper">
      <div className="time-wrapper">
        <span className="normal-text">{memo.timeStr}</span>
      </div>
      <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formattedContent }}></div>
    </div>
  );
};

export default DailyMemo;
