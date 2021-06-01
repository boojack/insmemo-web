import React, { useCallback, useEffect, useState } from "react";
import { api } from "../helpers/api";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import memoService from "../helpers/memoService";
import { historyService } from "../helpers/historyService";
import { useToggle } from "../hooks/useToggle";
import "../less/tag-list.less";

interface TagItem extends Api.Tag {}

export const TagList: React.FunctionComponent = () => {
  const [usedTags, setUsedTags] = useState<TagItem[]>([]);
  const [unusedTags, setUnusedTags] = useState<TagItem[]>([]);
  const [tagQuery, setTagQuery] = useState(historyService.query.tag);
  const [showUnusedTagsContainer, toggleShowUnusedTagsStatus] = useToggle(false);

  useEffect(() => {
    const ctx = {
      key: Date.now(),
    };

    const fetchTags = async () => {
      const { data: tags } = await api.getMyTags();
      const usedTags = [];
      const unusedTags = [];

      for (const t of tags) {
        if (t.amount === 0) {
          unusedTags.push(t);
        } else {
          usedTags.push(t);
        }
      }

      setUsedTags([...usedTags.sort((a, b) => b.createdAt - a.createdAt).sort((a, b) => b.level - a.level)]);
      setUnusedTags([...unusedTags.sort((a, b) => b.createdAt - a.createdAt).sort((a, b) => b.level - a.level)]);
    };

    const unsubscribeMemoStore = memoService.subscribe(() => {
      fetchTags();
    });

    historyService.bindStateChange(ctx, (query) => {
      setTagQuery(query.tag);

      // 删除移动端样式
      const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
      if (pageContainerEl) {
        pageContainerEl.classList.remove(MOBILE_ADDITION_CLASSNAME);
      }
    });

    return () => {
      unsubscribeMemoStore();
      historyService.unbindStateListener(ctx);
    };
  }, []);

  const handleUsedTagClick = useCallback(
    (tag: TagItem) => {
      let tagText = tag.text;

      if (tagText === tagQuery) {
        tagText = "";
      } else {
        api.polishTag(tag.id);
      }

      historyService.setParamsState({
        tag: tagText,
      });
    },
    [tagQuery]
  );

  const handleUnusedTagClick = useCallback(
    async (tag: TagItem, index: number) => {
      unusedTags.splice(index, 1);
      setUnusedTags([...unusedTags]);
      await api.deleteTagById(tag.id);
    },
    [unusedTags]
  );

  return (
    <div className="tags-container">
      <p className="title-text">常用标签</p>
      {usedTags.map((t) => (
        <div
          key={t.id}
          className={"tag-item-container used-tag-container " + (tagQuery === t.text ? "active" : "")}
          onClick={() => {
            handleUsedTagClick(t);
          }}
        >
          <span># {t.text}</span>
        </div>
      ))}

      <div className={"unused-tag-wrapper " + (unusedTags.length === 0 || !showUnusedTagsContainer ? "hidden" : "")}>
        {unusedTags.map((t, index) => (
          <div key={t.id} className={"tag-item-container unused-tag-container"}>
            <span># {t.text}</span>
            <span
              className="action-btn"
              onClick={() => {
                handleUnusedTagClick(t, index);
              }}
            >
              删除
            </span>
          </div>
        ))}
      </div>

      <p className={"action-text " + (unusedTags.length === 0 ? "hidden" : "")} onClick={toggleShowUnusedTagsStatus}>
        有 {unusedTags.length} 个未使用的标签，点击{showUnusedTagsContainer ? "隐藏" : "显示"}
      </p>

      {usedTags.length + unusedTags.length <= 3 ? (
        <p className="tag-tip-container">
          输入<span>#Tag#</span>来创建标签吧~
        </p>
      ) : null}
    </div>
  );
};
