import { useContext, useEffect, useState } from "react";
import { locationService, memoService } from "../services";
import useToggle from "../hooks/useToggle";
import Only from "./common/OnlyWhen";
import appContext from "../labs/appContext";
import * as utils from "../helpers/utils";
import "../less/tag-list.less";

interface Tag {
  key: string;
  text: string;
  subTags: Tag[];
}

interface Props {}

const TagList: React.FC<Props> = () => {
  const {
    locationState: { query },
    memoState: { tags: tagsText, memos },
  } = useContext(appContext);
  const [status, refresh] = useToggle();
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagQuery, setTagQuery] = useState<string>(query.tag);

  useEffect(() => {
    memoService.updateTagsState();
  }, [memos]);

  useEffect(() => {
    const sortedTags = Array.from(tagsText).sort();
    const root: IterObject<any> = {
      subTags: [],
    };
    for (const tag of sortedTags) {
      const subtags = tag.split("/");
      let tempObj = root;
      let tagText = "";
      for (let i = 0; i < subtags.length; i++) {
        const key = subtags[i];
        if (i === 0) {
          tagText += key;
        } else {
          tagText += "/" + key;
        }

        let obj = null;

        for (const t of tempObj.subTags) {
          if (t.text === tagText) {
            obj = t;
            break;
          }
        }

        if (!obj) {
          obj = {
            key,
            text: tagText,
            subTags: [],
          };
          tempObj.subTags.push(obj);
        }

        tempObj = obj;
      }
    }

    setTags(root.subTags as Tag[]);
  }, [tagsText, status]);

  useEffect(() => {
    setTagQuery(query.tag);
  }, [query]);

  return (
    <div className="tags-wrapper">
      <p className="title-text">全部标签</p>
      <div className="tags-container">
        {tags.map((t, idx) => (
          <TagItemContainer key={t.text + "-" + idx} tag={t} tagQuery={tagQuery} refresh={refresh} />
        ))}
        <Only when={tags.length < 5}>
          <p className="tag-tip-container">
            输入<span className="code-text"># Tag </span>来创建标签吧~
          </p>
        </Only>
      </div>
    </div>
  );
};

interface TagItemContainerProps {
  tag: Tag;
  tagQuery: string;
  refresh: () => void;
}

const TagItemContainer: React.FC<TagItemContainerProps> = (props: TagItemContainerProps) => {
  const { refresh, tag, tagQuery } = props;
  const isActive = tagQuery === tag.text;
  const hasSubTags = tag.subTags.length > 0;
  const [showSubTags, toggleSubTags] = useToggle(false);

  const handleTagClick = () => {
    locationService.pushHistory("/");
    if (isActive) {
      locationService.setTagQuery("");
    } else {
      utils.copyTextToClipboard(`# ${tag.text} `);
      locationService.setTagQuery(tag.text);
    }
  };

  const handleToggleBtnClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSubTags();
  };

  return (
    <>
      <div className={`tag-item-container ${isActive ? "active" : ""}`} onClick={handleTagClick}>
        <div className="tag-text-container">
          <span className="icon-text">#</span>
          <span className="tag-text">{tag.key}</span>
        </div>
        <div className="btns-container">
          {hasSubTags ? (
            <span className={`action-btn toggle-btn ${showSubTags ? "shown" : ""}`} onClick={handleToggleBtnClick}>
              <img className="icon-img" src={`/icons/arrow-right${isActive ? "-white" : ""}.svg`} />
            </span>
          ) : null}
        </div>
      </div>

      {hasSubTags ? (
        <div className={`subtags-container ${showSubTags ? "" : "hidden"}`}>
          {tag.subTags.map((st, idx) => (
            <TagItemContainer key={st.text + "-" + idx} tag={st} tagQuery={tagQuery} refresh={refresh} />
          ))}
        </div>
      ) : null}
    </>
  );
};

export default TagList;
