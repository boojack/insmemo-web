import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { utils } from "../helpers/utils";
import { FETCH_MEMO_AMOUNT } from "../helpers/consts";
import memoService from "../helpers/memoService";
import locationService from "../helpers/locationService";
import Memo from "./Memo";
import "../less/memolist.less";

interface Duration {
  from: number;
  to: number;
}

const MemoList: React.FC = () => {
  const [memos, setMemos] = useState<Model.Memo[]>(memoService.getState().memos ?? []);
  const { query } = locationService.getState();
  const [tagQuery, setTagQuery] = useState(query.tag);
  const [duration, setDuration] = useState<Duration>({ from: query.from, to: query.to });
  const [isFetching, setFetchStatus] = useState(false);
  const [isComplete, setCompleteStatus] = useState(false);
  const wrapperElement = useRef<HTMLDivElement>(null);

  const memosTemp = useMemo(() => {
    return memos.map((m) => {
      let shouldShow = true;

      if (tagQuery !== "" && !m.tags?.map((t) => t.text).includes(tagQuery)) {
        shouldShow = false;
      }

      if (duration.from !== 0 && duration.from < duration.to && (m.createdAt < duration.from || m.createdAt > duration.to)) {
        shouldShow = false;
      }

      return {
        ...m,
        shouldShow,
      };
    });
  }, [memos, tagQuery, duration]);

  useEffect(() => {
    const unsubscribeMemoService = memoService.subscribe(({ memos }) => {
      setMemos([...memos]);
    });

    const unsubscribeLocationService = locationService.subscribe(({ query }) => {
      const { tag, from, to } = query;
      setTagQuery(tag);
      if (from < to) {
        setDuration({ from, to });
      } else {
        setDuration({ from: 0, to: 0 });
      }
      wrapperElement.current?.scrollTo({ top: 0 });
    });

    return () => {
      unsubscribeMemoService();
      unsubscribeLocationService();
    };
  }, []);

  useEffect(() => {
    if ((tagQuery !== "" || duration.from < duration.to) && !isFetching && !isComplete) {
      fetchMoreMemos();
    }
  }, [tagQuery, duration, isFetching, isComplete]);

  const handleDeleteMemoItem = async (idx: number) => {
    await memoService.deleteMemoById(memos[idx].id);
    await fetchMoreMemos();
  };

  const fetchMoreMemos = useCallback(async () => {
    if (isFetching || isComplete) {
      return;
    }

    setFetchStatus(true);
    const newMemos = await memoService.fetchMoreMemos();
    if (newMemos && newMemos.length < FETCH_MEMO_AMOUNT) {
      setCompleteStatus(true);
    }
    setFetchStatus(false);
  }, [isFetching, isComplete]);

  const handleFetchScroll = useDebounce(
    () => {
      if (isFetching || isComplete) {
        return;
      }

      const el = wrapperElement.current;
      if (el) {
        const { offsetHeight, scrollTop, scrollHeight } = el;

        if (offsetHeight + scrollTop + 1 > scrollHeight) {
          fetchMoreMemos();
        }
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

      {memosTemp.map((memo, idx) => {
        const key = memo.id + " " + memo.updatedAt;
        const className = memo.shouldShow ? "" : "hidden";

        return <Memo key={key} className={className} index={idx} memo={memo} delete={handleDeleteMemoItem} />;
      })}

      <div
        className={
          "status-text-container " +
          (isFetching || isComplete ? "" : "invisible") +
          (tagQuery || duration.from < duration.to ? " invisible" : "")
        }
      >
        <p className="status-text">{isComplete ? "所有数据加载完啦 🎉" : "努力请求数据中..."}</p>
      </div>
    </div>
  );
};

export default MemoList;
