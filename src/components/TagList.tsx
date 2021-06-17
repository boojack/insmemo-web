import React, { useCallback, useEffect, useState } from "react";
import { api } from "../helpers/api";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import memoService from "../helpers/memoService";
import locationService from "../helpers/locationService";
import "../less/tag-list.less";

interface TagItem extends Api.Tag {}

const TagList: React.FunctionComponent = () => {
  const [tags, setTags] = useState<TagItem[]>([]);
  const { query } = locationService.getState();
  const [tagQuery, setTagQuery] = useState(query.tag);

  useEffect(() => {
    const fetchTags = async () => {
      const { data: tags } = await api.getMyTags();

      setTags([...tags.sort((a, b) => b.createdAt - a.createdAt).sort((a, b) => b.level - a.level)]);
    };

    const unsubscribeMemoService = memoService.subscribe(() => {
      fetchTags();
    });

    const unsubscribeLocationService = locationService.subscribe(({ query }) => {
      setTagQuery(query.tag);

      // 删除移动端样式
      const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
      pageContainerEl?.classList.remove(MOBILE_ADDITION_CLASSNAME);
    });

    return () => {
      unsubscribeMemoService();
      unsubscribeLocationService();
    };
  }, []);

  const handleTagClick = useCallback(
    (tag: TagItem) => {
      let tagText = tag.text;

      if (tagText === tagQuery) {
        tagText = "";
      } else {
        api.polishTag(tag.id);
      }

      locationService.setTagQuery(tagText);
    },
    [tagQuery]
  );

  return (
    <div className="tags-container">
      <p className="title-text">常用标签</p>
      {tags.map((t) => (
        <div
          key={t.id}
          className={"tag-item-container used-tag-container " + (tagQuery === t.text ? "active" : "")}
          onClick={() => {
            handleTagClick(t);
          }}
        >
          <span className="tag-text"># {t.text}</span>
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

export default TagList;
