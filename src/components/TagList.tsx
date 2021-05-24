import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { historyService } from "../helpers/historyService";
import { memoService } from "../helpers/memoService";
import "../less/tag-list.less";

export const TagList: React.FunctionComponent = () => {
  const [tags, setTags] = useState<Model.Tag[]>([]);
  const [tagQuery, setTagQuery] = useState(historyService.querys.tag);

  useEffect(() => {
    const ctx = {
      key: Date.now(),
    };

    const fetchTags = async () => {
      let { data: tags } = await api.getMyTags();
      tags = tags
        .map((t) => {
          return {
            ...t,
            createdAt: new Date(t.createdAt).getTime(),
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt)
        .sort((a, b) => b.level - a.level);

      setTags(tags);
    };

    memoService.bindStateChange(ctx, () => {
      fetchTags();
    });

    historyService.bindStateChange(ctx, (querys) => {
      setTagQuery(querys.tag);
    });

    return () => {
      memoService.unbindStateListener(ctx);
      historyService.unbindStateListener(ctx);
    };
  }, []);

  const handleTagItemClick = (index: number) => {
    let tagText = tags[index].text;

    if (tagText === tagQuery) {
      tagText = "";
    } else {
      api.polishTag(tags[index].id);
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
            handleTagItemClick(index);
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
};
