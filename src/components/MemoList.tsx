import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { FETCH_MEMO_AMOUNT } from "../helpers/consts";
import memoService from "../helpers/memoService";
import { historyService } from "../helpers/historyService";
import { preferences } from "./PreferencesDialog";
import { Memo } from "./Memo";
import "../less/memolist.less";

export const MemoList: React.FunctionComponent = () => {
  const [memos, setMemos] = useState<Model.Memo[]>(memoService.getState().memos ?? []);
  const [tagQuery, setTagQuery] = useState(historyService.query.tag ?? "");
  const [isFetching, setFetchStatus] = useState(false);
  const [isComplete, setCompleteStatus] = useState(false);
  const [shouldSplitMemoWord, setShouldSplitMemoWord] = useState(preferences.shouldSplitMemoWord ?? true);
  const wrapperElement = useRef<HTMLDivElement>(null);

  const memosTemp = useMemo(() => {
    return memos.map((m) => {
      let shouldShow = false;

      if (tagQuery === "" || m.tags?.map((t) => t.text).includes(tagQuery)) {
        shouldShow = true;
      }

      return {
        ...m,
        shouldShow,
      };
    });
  }, [memos, tagQuery]);

  useEffect(() => {
    const ctx = {
      key: Date.now(),
    };

    const unsubscribeMemoStore = memoService.subscribe(({ memos }) => {
      setMemos([...memos]);
    });

    historyService.bindStateChange(ctx, (query) => {
      setTagQuery(query.tag);
    });

    const handleStorageDataChanged = () => {
      const shouldSplitMemoWord = preferences.shouldSplitMemoWord ?? false;
      setShouldSplitMemoWord(shouldSplitMemoWord);
    };

    window.addEventListener("storage", handleStorageDataChanged);

    return () => {
      unsubscribeMemoStore();
      historyService.unbindStateListener(ctx);
      window.removeEventListener("storage", handleStorageDataChanged);
    };
  }, []);

  useEffect(() => {
    if (tagQuery !== "" && !isFetching && !isComplete) {
      fetchMoreMemos();
    }
  }, [tagQuery, isFetching, isComplete]);

  const handleDeleteMemoItem = async (idx: number) => {
    await memoService.deleteMemoById(memos[idx].id);
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
      {memosTemp.map((memo, idx) => {
        const key = memo.id + " " + memo.updatedAt;
        const className = memo.shouldShow ? "" : "hidden";

        return (
          <Memo
            key={key}
            className={className}
            shouldSplitMemoWord={shouldSplitMemoWord}
            index={idx}
            memo={memo}
            delete={handleDeleteMemoItem}
          />
        );
      })}

      <div className={"status-text-container " + (isFetching || isComplete ? "" : "invisible") + (tagQuery ? " invisible" : "")}>
        <p className="status-text">{isComplete ? "所有数据加载完啦 🎉" : "努力请求数据中..."}</p>
      </div>
    </div>
  );
};
