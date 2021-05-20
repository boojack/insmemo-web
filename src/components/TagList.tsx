import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { historyService } from "../helpers/historyService";
import "../less/tag-list.less";

export function TagList() {
  const [tags, setTags] = useState<Model.Tag[]>([]);
  const [tagQuery, setTagQuery] = useState(historyService.querys.tag);

  useEffect(() => {
    const fetchTags = async () => {
      let { data: tags } = await api.getMyTags();
      tags = tags
        .map((t) => {
          return {
            ...t,
            createdAt: new Date(t.createdAt).getTime(),
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt);

      setTags(tags);
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const ctx = {
      key: Date.now(),
    };
    historyService.bindStateChange(ctx, (querys) => {
      setTagQuery(querys.tag);
    });

    return () => {
      historyService.unbindStateListener(ctx);
    };
  }, [tagQuery]);

  const handleTagItemClick = (index: number, tagId: string) => {
    let tagText = tags[index].text;

    if (tagText === tagQuery) {
      tagText = "";
    }
    historyService.setParamsState({
      tag: tagText,
    });
  };

  return (
    <div className="tags-container">
      <p className="title-text">常用标签</p>
      {tags.map((t, index) => (
        <div
          key={t.id}
          className={"tag-item-container " + (tagQuery === t.text ? "active" : "")}
          onClick={() => {
            handleTagItemClick(index, t.id);
          }}
        >
          <span># {t.text}</span>
        </div>
      ))}

      {tags.length <= 3 ? (
        <p className="tag-tip-container">
          输入<span>#Tag#</span>来创建标签吧~
        </p>
      ) : null}
    </div>
  );
}
