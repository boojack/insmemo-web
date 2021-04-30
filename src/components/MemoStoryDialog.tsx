import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { api } from "../helpers/api";
import { utils } from "../helpers/utils";
import "../less/memo-story-dialog.less";

interface Props {
  memoId: string;
  destory: FunctionType;
}

interface MemoItem extends Model.Memo {
  formatedContent: string;
  createdAtStr: string;
}

export function MemoStoryDialog(props: Props) {
  const [memos, setMemos] = useState<MemoItem[]>([]);

  useEffect(() => {
    const fetchMemos = async () => {
      const memoIdList = [props.memoId];
      const memoList: MemoItem[] = [];

      while (memoIdList.length > 0) {
        const id = memoIdList.shift();

        if (id) {
          const { data: memo } = await api.getMemoById(id);

          memoList.push({
            ...memo,
            formatedContent: filterMemoContent(memo.content),
            createdAtStr: utils.getTimeString(memo.createdAt),
          });

          if (memo.uponMemoId) {
            memoIdList.push(memo.uponMemoId);
          }
          setMemos([...memoList]);
        }
      }
    };

    fetchMemos();
  }, []);

  return (
    <div className="dialog-wrapper memo-story-dialog">
      <div className="dialog-container">
        <div className="dialog-header-container">
          <p className="title-text">有 {memos.length} 个 Memo 😀</p>
          <button className="text-btn close-btn" onClick={props.destory}>
            ❌
          </button>
        </div>
        <div className="dialog-content-container">
          {memos.map((m) => (
            <div className="memo-container" key={m.id}>
              <p className="time-text">{m.createdAtStr}</p>
              <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: m.formatedContent }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function showMemoStoryDialog(memoId: string) {
  const div = document.createElement("div");
  document.body.append(div);

  const destory = () => {
    ReactDOM.unmountComponentAtNode(div);
    div.remove();
  };
  ReactDOM.render(<MemoStoryDialog memoId={memoId} destory={destory} />, div);
}

function filterMemoContent(content: string): string {
  const tagReg = /#(.+?)#/g;
  return content.replaceAll("\n", "<br>").replaceAll(tagReg, "<span class='tag-span'>#$1</span>");
}
