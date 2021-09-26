import React, { useContext, useEffect, useRef, useState } from "react";
import { locationService, memoService } from "../services";
import useDebounce from "../hooks/useDebounce";
import appContext from "../labs/appContext";
import { IMAGE_URL_REG, LINK_REG, MEMO_TYPES, TAG_REG } from "../helpers/consts";
import { utils } from "../helpers/utils";
import Memo from "./Memo";
import toastHelper from "./Toast";
import "../less/memolist.less";

const getTextWithMemoType = (type: string): string => {
  for (const t of MEMO_TYPES) {
    if (t.type === type) {
      return t.text;
    }
  }
  return "";
};

interface Duration {
  from: number;
  to: number;
}

interface Props {}

const MemoList: React.FC<Props> = () => {
  const {
    locationState: { query },
    memoState: { memos },
  } = useContext(appContext);
  const [isFetching, setFetchStatus] = useState(false);
  const [isComplete, setCompleteStatus] = useState(false);
  const wrapperElement = useRef<HTMLDivElement>(null);

  const tagQuery = query.tag;
  const duration: Duration = { from: query.from, to: query.to };
  const memoType = query.type;
  const textQuery = query.text;
  const showFilter = Boolean(tagQuery || (duration.from !== 0 && duration.from < duration.to) || memoType || textQuery);

  const shownMemos = memos.filter((memo) => {
    let shouldShow = true;

    if (tagQuery !== "" && !memo.tags?.map((t) => t.text).includes(tagQuery)) {
      shouldShow = false;
    }
    if (duration.from !== 0 && duration.from < duration.to && (memo.createdAt < duration.from || memo.createdAt > duration.to)) {
      shouldShow = false;
    }
    if (memoType !== "") {
      if (memoType === "NO_TAG") {
        if (memo.content.match(TAG_REG) !== null) {
          shouldShow = false;
        }
      } else if (memoType === "LINKED") {
        if (memo.content.match(LINK_REG) === null) {
          shouldShow = false;
        }
      } else if (memoType === "IMAGED") {
        if (memo.content.match(IMAGE_URL_REG) === null) {
          shouldShow = false;
        }
      }
    }
    if (textQuery !== "" && !memo.content.includes(textQuery)) {
      shouldShow = false;
    }

    return shouldShow;
  });

  useEffect(() => {
    wrapperElement.current?.scrollTo({ top: 0 });
    if (!isComplete && showFilter) {
      setFetchStatus(true);
      memoService.fetchAllMemos().then(() => {
        setCompleteStatus(true);
        setFetchStatus(false);
      });
    }
  }, [showFilter, isComplete]);

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
    } catch (error: any) {
      toastHelper.error(error.message);
    }
    setFetchStatus(false);
  };

  const handleContainerScroll = useDebounce(
    () => {
      const { offsetHeight, scrollTop, scrollHeight } = wrapperElement.current!;
      if (offsetHeight + scrollTop + 10 > scrollHeight) {
        fetchMoreMemos();
      }
    },
    100,
    []
  );

  return (
    <div className="memolist-wrapper" ref={wrapperElement} onScroll={handleContainerScroll}>
      <MemoFilter {...{ showFilter, tagQuery, duration, memoType, textQuery }} />

      {shownMemos.map((memo) => (
        <Memo key={`${memo.id}-${memo.updatedAt}`} memo={memo} />
      ))}

      {showFilter ? (
        <div className={`status-text-container`}>
          <p className="status-text">{isFetching ? "努力请求数据中..." : shownMemos.length === 0 ? "空空如也" : ""}</p>
        </div>
      ) : (
        <div className={`status-text-container ${isComplete ? "completed" : ""} ${isFetching || isComplete ? "" : "invisible"}`}>
          <p className="status-text">{isComplete ? "所有数据加载完啦 🎉" : "努力请求数据中..."}</p>
        </div>
      )}
    </div>
  );
};

interface FilterProps {
  showFilter: boolean;
  tagQuery: string;
  duration: Duration;
  memoType: string;
  textQuery: string;
}

const MemoFilter: React.FC<FilterProps> = (props) => {
  const { showFilter, tagQuery, duration, memoType, textQuery } = props;

  return (
    <div className={`filter-query-container ${showFilter ? "" : "hidden"}`}>
      <span className="tip-text">筛选：</span>
      <div
        className={"filter-item-container " + (duration.from !== 0 && duration.from < duration.to ? "" : "hidden")}
        onClick={() => {
          locationService.setFromAndToQuery(0, 0);
        }}
      >
        <span className="icon-text">🗓️</span> {utils.getDateString(duration.from)} 至 {utils.getDateString(duration.to)}
      </div>
      <div
        className={"filter-item-container " + (tagQuery ? "" : "hidden")}
        onClick={() => {
          locationService.setTagQuery("");
        }}
      >
        <span className="icon-text">🏷️</span> {tagQuery}
      </div>
      <div
        className={"filter-item-container " + (memoType ? "" : "hidden")}
        onClick={() => {
          locationService.setMemoTypeQuery("");
        }}
      >
        <span className="icon-text">📦</span> {getTextWithMemoType(memoType as MemoType)}
      </div>
      <div
        className={"filter-item-container " + (textQuery ? "" : "hidden")}
        onClick={() => {
          locationService.setTextQuery("");
        }}
      >
        <span className="icon-text">🔍</span> {textQuery}
      </div>
    </div>
  );
};

export default MemoList;
