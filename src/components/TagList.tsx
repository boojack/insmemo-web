import React, { useEffect, useState } from "react";
import { locationStore, memoStore } from "../stores";
import { locationService } from "../services";
import { api } from "../helpers/api";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import toast from "./Toast";
import useSelector from "../hooks/useSelector";
import useToggle from "../hooks/useToggle";
import "../less/tag-list.less";

interface TagItem extends Api.Tag {}

const TagList: React.FC = () => {
  const { query } = useSelector(locationStore);
  const { memos } = useSelector(memoStore);
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

    fetchTags();
  }, [memos]);

  useEffect(() => {
    setTagQuery(query.tag);

    // Hide user banner in mobile web
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
    pageContainerEl?.classList.remove(MOBILE_ADDITION_CLASSNAME);
  }, [query]);

  const handleTagClick = (tag: TagItem) => {
    const tagText = tag.text === tagQuery ? "" : tag.text;
    if (tagText) {
      polishTag(tag.id);
    }
    locationService.setTagQuery(tagText);
  };

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
