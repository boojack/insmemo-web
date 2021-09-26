import React, { useContext, useEffect, useState } from "react";
import { locationService, memoService, userService } from "../services";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import useToggle from "../hooks/useToggle";
import Only from "./common/OnlyWhen";
import toastHelper from "./Toast";
import appContext from "../labs/appContext";
import useLoading from "../hooks/useLoading";
import "../less/tag-list.less";

interface Tag extends Api.Tag {
  key: string;
  subTags: Tag[];
  deep: number;
}

interface Props {}

const TagList: React.FC<Props> = () => {
  const {
    locationState: { query },
    memoState: { memos },
  } = useContext(appContext);
  const [tags, setTags] = useState<Tag[]>([]);
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
          const sortedTags = tags.sort((a, b) => b.createdAt - a.createdAt).sort((a, b) => b.level - a.level);
          const tree: IterObject = {};
          for (const tag of sortedTags) {
            const subtags = tag.text.split("/");
            let tempObj = tree;
            let tagText = "";
            for (let i = 0; i < subtags.length; i++) {
              const key = subtags[i];
              if (i === 0) {
                tagText += key;
              } else {
                tagText += "/" + key;
              }

              if (tempObj[key]) {
                tempObj[key].level += tag.level;
              } else {
                tempObj[key] = {
                  id: tag.id,
                  key,
                  text: tagText,
                  level: tag.level,
                  subTags: [],
                };
              }

              if (tempObj.subTags) {
                if (!tempObj.subTags.includes(tempObj[key])) {
                  tempObj.subTags.push(tempObj[key]);
                }
              } else {
                tempObj.subTags = [tempObj[key]];
              }

              if (tagText === tag.text) {
                tempObj[key].id = tag.id;
              }
              tempObj = tempObj[key];
            }
          }

          const fc = (nodes: Tag[], deep: number) => {
            nodes = nodes.sort((a: any, b: any) => b.level - a.level);
            for (const n of nodes) {
              n.deep = deep;
              if (n.subTags) {
                fc(n.subTags, deep + 1);
              }
            }
          };

          if (tree.subTags) {
            fc(tree.subTags, 0);
            setTags(tree.subTags);
            loadingState.setFinish();
          }
        }
      })
      .catch((error) => {
        loadingState.setError();
        toastHelper.error(error);
      });
  }, [memos]);

  useEffect(() => {
    setTagQuery(query.tag);

    // Hide user banner in mobile view
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
    pageContainerEl?.classList.remove(MOBILE_ADDITION_CLASSNAME);
  }, [query]);

  return (
    <div className="tags-wrapper">
      <p className="title-text">常用标签</p>
      <div className="tags-container">
        {loadingState.isLoading ? (
          <></>
        ) : (
          <>
            {tags.map((t) => (
              <TagItemContainer key={t.id} tag={t} tagQuery={tagQuery} />
            ))}
            <Only when={tags.length < 5}>
              <p className="tag-tip-container">
                输入<span className="code-text"># Tag </span>来创建标签吧~
              </p>
            </Only>
          </>
        )}
      </div>
    </div>
  );
};

interface TagItemContainerProps {
  tag: Tag;
  tagQuery: string;
}

const TagItemContainer: React.FC<TagItemContainerProps> = (props: TagItemContainerProps) => {
  const { tag, tagQuery } = props;
  const isActive = tagQuery === tag.text;
  const hasSubTags = tag.subTags.length > 0;
  const [showSubTags, toggleSubTags] = useToggle(tagQuery.includes(tag.text) && !isActive);

  useEffect(() => {
    if (!showSubTags) {
      toggleSubTags(tagQuery.includes(tag.text) && !isActive);
    }
  }, [tagQuery, tag]);

  const handleTagClick = () => {
    const tagText = isActive ? "" : tag.text;
    if (tagText) {
      memoService.polishTag(tag.id).catch(() => {
        // do nth
      });
    }
    locationService.setTagQuery(tagText);
  };

  const handleToggleBtnClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSubTags();
  };

  return (
    <>
      <div className={`tag-item-container ${isActive ? "active" : ""}`} onClick={handleTagClick}>
        <span className="tag-text" style={{ paddingLeft: tag.deep * 12 }}>
          # {tag.key}
        </span>
        {hasSubTags ? (
          <span className={`toggle-btn ${showSubTags ? "shown" : ""}`} onClick={handleToggleBtnClick}>
            {isActive ? (
              <img className="icon-img" src="/icons/arrow-right-white.svg" />
            ) : (
              <img className="icon-img" src="/icons/arrow-right.svg" />
            )}
          </span>
        ) : null}
      </div>

      {hasSubTags && showSubTags
        ? tag.subTags.map((st) => {
            return <TagItemContainer key={st.id} tag={st} tagQuery={tagQuery} />;
          })
        : null}
    </>
  );
};

export default TagList;
