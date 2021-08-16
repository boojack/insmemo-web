import React, { useEffect, useRef, useState } from "react";
import { locationStore, memoStore } from "../stores";
import { locationService, memoService } from "../services";
import useDebounce from "../hooks/useDebounce";
import useSelector from "../hooks/useSelector";
import { utils } from "../helpers/utils";
import Memo from "./Memo";
import toastHelper from "./Toast";
import "../less/memolist.less";

interface Duration {
  from: number;
  to: number;
}

interface Props {}

const MemoList: React.FC<Props> = () => {
  const { memos } = useSelector(memoStore);
  const [isFetching, setFetchStatus] = useState(false);
  const [isComplete, setCompleteStatus] = useState(false);
  const wrapperElement = useRef<HTMLDivElement>(null);
  const { query } = useSelector(locationStore);
  const tagQuery = query.tag;
  const duration: Duration = { from: query.from, to: query.to };

  useEffect(() => {
    wrapperElement.current?.scrollTo({ top: 0 });
    if (!isComplete && (tagQuery !== "" || duration.from < duration.to)) {
      memoService.fetchAllMemos();
      setCompleteStatus(true);
    }
  }, [location.search, isComplete]);

  const fetchMoreMemos = async () => {
    if (isFetching || isComplete) {
      return;
    }

    setFetchStatus(true);
    try {
      const fetchedMemos = await memoService.fetchMoreMemos();
      if (fetchedMemos && fetchedMemos.length === 0) {
        setCompleteStatus(true);
      }
    } catch (error) {
      toastHelper.error(error.message);
    }
    setFetchStatus(false);
  };

  const handleFetchScroll = useDebounce(
    () => {
      const { offsetHeight, scrollTop, scrollHeight } = wrapperElement.current!;
      if (offsetHeight + scrollTop + 10 > scrollHeight) {
        fetchMoreMemos();
      }
    },
    200,
    [isFetching, isComplete]
  );

  return (
    <div className="memolist-wrapper" ref={wrapperElement} onScroll={handleFetchScroll}>
      <div className="filter-query-container">
        <span className={"tip-text " + (tagQuery || (duration.from !== 0 && duration.from < duration.to) ? "" : "hidden")}>筛选：</span>
        <div
          className={"filter-item-container " + (tagQuery ? "" : "hidden")}
          onClick={() => {
            locationService.setTagQuery("");
          }}
        >
          <span className="icon-text">🏷️</span> {tagQuery}
        </div>
        <div
          className={"filter-item-container " + (duration.from !== 0 && duration.from < duration.to ? "" : "hidden")}
          onClick={() => {
            locationService.setFromAndToQuery(0, 0);
          }}
        >
          <span className="icon-text">🗓️</span> {utils.getDateString(duration.from)} 至 {utils.getDateString(duration.to)}
        </div>
      </div>

      {memos.map((memo, idx) => {
        const key = memo.id + " " + memo.updatedAt;
        let shouldShow = true;
        if (tagQuery !== "" && !memo.tags?.map((t) => t.text).includes(tagQuery)) {
          shouldShow = false;
        }
        if (duration.from !== 0 && duration.from < duration.to && (memo.createdAt < duration.from || memo.createdAt > duration.to)) {
          shouldShow = false;
        }
        const additionClassName = shouldShow ? "" : "hidden";

        return <Memo key={key} index={idx} className={additionClassName} memo={memo} />;
      })}

      <div
        className={`status-text-container ${isComplete ? "completed" : ""} ${isFetching || isComplete ? "" : "invisible"} ${
          tagQuery || duration.from < duration.to ? "invisible" : ""
        }`}
      >
        <p className="status-text">{isComplete ? "所有数据加载完啦 🎉" : "努力请求数据中..."}</p>
      </div>
    </div>
  );
};

export default MemoList;
