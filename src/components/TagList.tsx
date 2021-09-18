import React, { useEffect, useState } from "react";
import appStore from "../stores";
import { locationService, memoService, userService } from "../services";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import Only from "./common/OnlyWhen";
import toastHelper from "./Toast";
import useSelector from "../hooks/useSelector";
import useLoading from "../hooks/useLoading";
import "../less/tag-list.less";

interface TagItem extends Api.Tag {}

interface Props {}

const TagList: React.FC<Props> = () => {
  const {
    locationState: { query },
    memoState: { memos },
  } = useSelector(appStore);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [tagQuery, setTagQuery] = useState(query.tag);
  const loadingState = useLoading();

  useEffect(() => {
    if (!userService.getState().user) {
      return;
    }

    memoService
      .getMyTags()
      .then((tags) => {
        if (tags) {
          setTags([...tags.sort((a, b) => b.createdAt - a.createdAt).sort((a, b) => b.level - a.level)]);
          loadingState.setFinish();
        }
      })
      .catch((error) => {
        loadingState.setError();
        toastHelper.error(error);
      });
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
      memoService.polishTag(tag.id).catch(() => {
        // do nth
      });
    }
    locationService.setTagQuery(tagText);
  };

  return (
    <div className="tags-wrapper">
      <p className="title-text">常用标签</p>
      <div className="tags-container">
        {loadingState.isLoading ? (
          <></>
        ) : (
          <>
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
            <Only when={tags.length <= 3}>
              <p className="tag-tip-container">
                输入<span>#Tag#</span>来创建标签吧~
              </p>
            </Only>
          </>
        )}
      </div>
    </div>
  );
};

export default TagList;
