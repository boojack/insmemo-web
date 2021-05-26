import React, { useEffect, useRef, useState } from "react";
import { FETCH_MEMO_AMOUNT } from "../helpers/consts";
import { utils } from "../helpers/utils";
import { preferences } from "./PreferencesDialog";
import { memoService } from "../helpers/memoService";
import { historyService } from "../helpers/historyService";
import { Memo } from "./Memo";
import "../less/memolist.less";

export const MemoList: React.FunctionComponent = () => {
  const [memos, setMemos] = useState(memoService.getMemos());
  const [tagQuery, setTagQuery] = useState(historyService.querys.tag);
  const [isFetching, setFetchStatus] = useState(false);
  const [isComplete, setCompleteStatus] = useState(false);
  const [shouldSplitMemoWord, setShouldSplitMemoWord] = useState<boolean>(preferences.shouldSplitMemoWord ?? false);
  const wrapperElement = useRef<HTMLDivElement>(null);

  const memosTemp = memos.map((m) => {
    let shouldShow = false;

    if (tagQuery === "" || m.tags?.map((t) => t.text).includes(tagQuery)) {
      shouldShow = true;
    }

    return {
      ...m,
      shouldShow,
    };
  });

  useEffect(() => {
    const handleStorageDataChanged = () => {
      const shouldSplitMemoWord = preferences.shouldSplitMemoWord ?? false;
      setShouldSplitMemoWord(shouldSplitMemoWord);
    };

    window.addEventListener("storage", handleStorageDataChanged);

    return () => {
      window.removeEventListener("storage", handleStorageDataChanged);
    };
  }, []);

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
    if (tagQuery !== "" && !isFetching && !isComplete) {
      fetchMoreMemos();
    }
  }, [tagQuery, isFetching, isComplete]);

  const handleDeleteMemoItem = async (idx: number) => {
    await memoService.deleteById(memos[idx].id);
  };

  const fetchMoreMemos = async () => {
    if (isFetching || isComplete) {
      return;
    }
    setFetchStatus(true);
    const newMemos = await memoService.fetchMoreMemos();
    if (newMemos && newMemos.length < FETCH_MEMO_AMOUNT) {
      setCompleteStatus(true);
    }
    setFetchStatus(false);
  };

  const handleFetchScroll = () => {
    if (isFetching || isComplete) {
      return;
    }

    const el = wrapperElement.current;
    const { offsetHeight, scrollTop, scrollHeight } = el!;

    if (offsetHeight + scrollTop + 1 > scrollHeight) {
      fetchMoreMemos();
    }
  };

  return (
    <div className="memolist-wrapper" ref={wrapperElement} onScroll={utils.debounce(handleFetchScroll, 200)}>
      {memosTemp.map((memo, idx) => (
        <Memo
          key={memo.id}
          className={memo.shouldShow ? "" : "hidden"}
          shouldSplitMemoWord={shouldSplitMemoWord}
          index={idx}
          memo={memo}
          delete={handleDeleteMemoItem}
        />
      ))}

      <div className={"status-text-container " + (isFetching || isComplete ? "" : "invisible") + (tagQuery ? " invisible" : "")}>
        <p className="status-text">{isComplete ? "所有数据加载完啦 🎉" : "努力请求数据中..."}</p>
      </div>
    </div>
  );
};
