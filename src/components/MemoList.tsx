import React, { useEffect, useRef, useState } from "react";
import { memoService } from "../helpers/memoService";
import { Memo } from "./Memo";
import { utils } from "../helpers/utils";
import "../less/memolist.less";

export function MemoList() {
  const [memos, setMemos] = useState(memoService.getMemos());
  const [isFetching, setFetchStatus] = useState(false);
  const [isComplete, setCompleteStatus] = useState(false);
  const wrapperElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = {
      key: Date.now(),
    };
    memoService.bindStateChange(ctx, (newMemos) => {
      setMemos(newMemos);
    });

    return () => {
      memoService.unbindStateListener(ctx);
    };
  }, []);

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

  return (
    <div className="memolist-wrapper" ref={wrapperElement} onScroll={utils.debounce(handleFetchScroll, 200)}>
      {memos.map((memo, idx) => {
        return <Memo key={memo.id} index={idx} memo={memo} delete={handleDeleteMemoItem} />;
      })}
      {/* {isFetching ? (
        <div className="status-text-container">
          <p className="status-text">加载更多数据中...</p>
        </div>
      ) : null} */}
      {isComplete ? (
        <div className="status-text-container">
          <p className="status-text">所有数据加载完啦 🎉</p>
        </div>
      ) : null}
    </div>
  );
}
