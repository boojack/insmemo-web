import React, { useEffect, useRef, useState } from "react";
import { utils } from "../helpers/utils";
import { preferences } from "./PreferencesDialog";
import { memoService } from "../helpers/memoService";
import { historyService } from "../helpers/historyService";
import { Memo } from "./Memo";
import "../less/memolist.less";

export function MemoList() {
  const [memos, setMemos] = useState(memoService.getMemos());
  const [tagQuery, setTagQuery] = useState(historyService.querys.tag);
  const [isFetching, setFetchStatus] = useState(false);
  const [isComplete, setCompleteStatus] = useState(false);
  const wrapperElement = useRef<HTMLDivElement>(null);
  const [shouldSplitMemoWord, setShouldSplitMemoWord] = useState<boolean>(preferences.shouldSplitMemoWord ?? false);

  useEffect(() => {
    const ctx = {
      key: Date.now(),
    };
    memoService.bindStateChange(ctx, (newMemos) => {
      setMemos([...newMemos]);
    });
    historyService.bindStateChange(ctx, (querys) => {
      setTagQuery(querys.tag);
    });

    return () => {
      memoService.unbindStateListener(ctx);
      historyService.unbindStateListener(ctx);
    };
  }, [shouldSplitMemoWord]);

  useEffect(() => {
    const handleStorageDataChanged = () => {
      if (preferences.shouldSplitMemoWord !== undefined && preferences.shouldSplitMemoWord !== shouldSplitMemoWord) {
        setShouldSplitMemoWord(preferences.shouldSplitMemoWord);
      }
    };

    window.addEventListener("storage", handleStorageDataChanged);

    return () => {
      window.removeEventListener("storage", handleStorageDataChanged);
    };
  }, [shouldSplitMemoWord]);

  const handleDeleteMemoItem = async (idx: number) => {
    await memoService.deleteById(memos[idx].id);
  };

  const handleFetchScroll = async () => {
    if (isFetching || isComplete) {
      return;
    }

    const el = wrapperElement.current;
    const { offsetHeight, scrollTop, scrollHeight } = el!;

    if (offsetHeight + scrollTop + 1 > scrollHeight) {
      setFetchStatus(true);
      const newMemos = await memoService.fetchMoreMemos();
      setFetchStatus(false);
      if (newMemos.length === 0) {
        setCompleteStatus(true);
      }
    }
  };

  let shownMemoCount = 0;
  const memosTemp = memos.map((m) => {
    let shouldShow = false;

    if (tagQuery === "" || m.tags?.map((t) => t.text).includes(tagQuery)) {
      shouldShow = true;
    }

    if (shouldShow) {
      shownMemoCount++;
    }

    return {
      ...m,
      shouldShow,
    };
  });

  return (
    <div className="memolist-wrapper" ref={wrapperElement} onScroll={utils.debounce(handleFetchScroll, 200)}>
      {memosTemp.map((memo, idx) => {
        return memo.shouldShow ? (
          <Memo key={memo.id} shouldSplitMemoWord={shouldSplitMemoWord} index={idx} memo={memo} delete={handleDeleteMemoItem} />
        ) : null;
      })}

      {isFetching ? (
        <div className="status-text-container">
          <p className="status-text">努力请求数据中...</p>
        </div>
      ) : null}
      {tagQuery === "" && isComplete ? (
        <div className="status-text-container">
          <p className="status-text">所有数据加载完啦 🎉</p>
        </div>
      ) : null}
    </div>
  );
}
