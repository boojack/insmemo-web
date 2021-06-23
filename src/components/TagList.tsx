import React, { useCallback, useEffect, useState } from "react";
import { api } from "../helpers/api";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import toast from "./Toast";
import useToggle from "../hooks/useToggle";
import memoService from "../helpers/memoService";
import locationService from "../helpers/locationService";
import "../less/tag-list.less";

interface TagItem extends Api.Tag {}

const TagList: React.FunctionComponent = () => {
  const { query } = locationService.getState();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [tagQuery, setTagQuery] = useState(query.tag);
  const [isLoading, setLoading] = useToggle(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getMyTags();

        setTags([...tags.sort((a, b) => b.createdAt - a.createdAt).sort((a, b) => b.level - a.level)]);
      } catch (error) {
        toast.error(error);
      }
      setLoading(false);
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
        polishTag(tag.id);
      }

      locationService.setTagQuery(tagText);
    },
    [tagQuery]
  );

  return (
    <div className="tags-wrapper">
      <p className="title-text">常用标签</p>
      <div className="tags-container">
        {isLoading ? (
          <></>
        ) : (
          <>
            {" "}
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
          </>
        )}
      </div>
    </div>
  );
};

function getMyTags(): Promise<Api.Tag[]> {
  return new Promise((resolve, reject) => {
    api
      .getMyTags()
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject("数据请求失败");
      });
  });
}

function polishTag(tagId: string) {
  api
    .polishTag(tagId)
    .then(() => {})
    .catch(() => {});
}

export default TagList;
