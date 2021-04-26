import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { stateManager } from "../helpers/StateManager";
import { userService } from "../helpers/userService";
import { utils } from "../helpers/utils";
import { useToggle } from "../hooks/useToggle";
import "../less/memo.less";

interface Props {
  memo: Model.Memo;
  index: number;
  deleteHandler: (idx: number) => void;
}

interface MemoItem extends Model.Memo {
  formatedContent: string;
  createdAtStr: string;
}

export function Memo(props: Props) {
  const memo = {
    ...props.memo,
    formatedContent: filterMemoContent(props.memo.content),
    createdAtStr: utils.getTimeString(props.memo.createdAt),
  };

  const [uponMemo, setUponMemo] = useState<MemoItem>();
  const [tags, setTags] = useState<Model.Tag[]>([]);
  const [showConfirmDeleteBtn, toggleConfirmDeleteBtn] = useToggle(false);

  useEffect(() => {
    const fetchTags = async () => {
      const { id } = memo;

      if (id) {
        const { data: tags } = await api.getTagsByMemoId(id);
        setTags(tags ?? []);
      }
    };

    const fetchUponMemo = async () => {
      const { uponMemoId } = memo;

      if (uponMemoId) {
        const { data: uponMemoData } = await api.getMemoById(uponMemoId);

        if (uponMemoData) {
          setUponMemo({
            ...uponMemoData,
            formatedContent: filterMemoContent(uponMemoData.content),
            createdAtStr: utils.getTimeString(uponMemoData.createdAt),
          });
        }
      }
    };

    const fetchData = async () => {
      if (userService.checkIsSignIn()) {
        fetchTags();
        fetchUponMemo();
      }
    };

    fetchData();
  }, []);

  const uponThisMemo = () => {
    stateManager.setState("uponMemoId", memo.id);
  };

  const deleteMemo = async () => {
    props.deleteHandler(props.index);

    if (memo.id.indexOf("local_") < 0) {
      await api.deleteMemo(memo.id);
    }
  };

  return (
    <div className="memo-wrapper">
      <div className="memo-top-wrapper">
        <span className="time-text">{memo.createdAtStr}</span>
        <div className="btns-container">
          <span className="text-btn" onClick={uponThisMemo}>
            Mark
          </span>
          {showConfirmDeleteBtn ? (
            <span className="text-btn" onClick={deleteMemo} onMouseLeave={toggleConfirmDeleteBtn}>
              确定删除
            </span>
          ) : (
            <span className="text-btn" onClick={toggleConfirmDeleteBtn}>
              删除
            </span>
          )}
        </div>
      </div>
      {/* TODO: 编辑 memo */}
      <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formatedContent }}></div>
      {uponMemo ? (
        <div className="uponmemo-container">
          <span className="icon-text">🧷</span>
          <div className="uponmemo-content-text" dangerouslySetInnerHTML={{ __html: uponMemo.formatedContent }}></div>
        </div>
      ) : null}
    </div>
  );
}

function filterMemoContent(content: string): string {
  const tagReg = /#(\w+) /g;
  return content.replaceAll("\n", "<br>").replaceAll(tagReg, "<span class='tag-span'>#$1</span>");
}
