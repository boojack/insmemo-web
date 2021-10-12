import { useContext, useEffect, useRef, useState } from "react";
import { locationService, memoService, userService } from "../services";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import useToggle from "../hooks/useToggle";
import Only from "./common/OnlyWhen";
import { showDialog } from "./Dialog";
import toastHelper from "./Toast";
import appContext from "../labs/appContext";
import useLoading from "../hooks/useLoading";
import { utils } from "../helpers/utils";
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
        const sortedTags = tags
          .sort((a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt))
          .sort((a, b) => b.level - a.level);
        const root: IterObject<any> = {
          subTags: [],
        };
        for (const tag of sortedTags) {
          const subtags = tag.text.split("/");
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

            if (obj) {
              obj.level += tag.level;
            } else {
              obj = {
                id: "",
                key,
                text: tagText,
                level: tag.level,
                subTags: [],
                deep: i,
              };
              tempObj.subTags.push(obj);
            }

            tempObj.subTags.sort((a: Tag, b: Tag) => b.level - a.level) as Tag[];
            if (tagText === tag.text) {
              obj.id = tag.id;
            }
            tempObj = obj;
          }
        }

        root.subTags.sort((a: Tag, b: Tag) => b.level - a.level);
        setTags(root.subTags as Tag[]);
        loadingState.setFinish();
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
            {tags.map((t, idx) => (
              <TagItemContainer key={t.id + "-" + idx} tag={t} tagQuery={tagQuery} />
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
  const renameAble = tag.id !== "";

  useEffect(() => {
    toggleSubTags(tagQuery.indexOf(tag.text) === 0 && !isActive);
  }, [tagQuery, tag]);

  const handleTagClick = () => {
    const tagText = isActive ? "" : tag.text;
    if (tagText) {
      utils.copyTextToClipboard(`# ${tagText} `);
      memoService.polishTag(tag.id).catch(() => {
        // do nth
      });
    }
    locationService.pushHistory("/");
    locationService.setTagQuery(tagText);
  };

  const handleRenameTagBtnClick = (event: React.MouseEvent) => {
    if (renameAble) {
      event.stopPropagation();
      showRenameTagDialog(tag);
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
          <div className={`icon-container ${renameAble ? "rename-able" : ""}`} onClick={handleRenameTagBtnClick}>
            <span className="icon-text">#</span>
            {renameAble ? (
              <span className="rename-btn">
                {isActive ? <img className="icon-img" src="/icons/edit-white.svg" /> : <img className="icon-img" src="/icons/edit.svg" />}
              </span>
            ) : null}
          </div>
          <span className="tag-text">{tag.key}</span>
        </div>
        <div className="btns-container">
          {hasSubTags ? (
            <span className={`action-btn toggle-btn ${showSubTags ? "shown" : ""}`} onClick={handleToggleBtnClick}>
              {isActive ? (
                <img className="icon-img" src="/icons/arrow-right-white.svg" />
              ) : (
                <img className="icon-img" src="/icons/arrow-right.svg" />
              )}
            </span>
          ) : null}
        </div>
      </div>

      {hasSubTags ? (
        <div className={`subtags-container ${showSubTags ? "" : "hidden"}`}>
          {tag.subTags.map((st, idx) => (
            <TagItemContainer key={st.id + "-" + idx} tag={st} tagQuery={tagQuery} />
          ))}
        </div>
      ) : null}
    </>
  );
};

interface RenameTagDialogProps extends DialogProps {
  tag: Tag;
}

const RenameTagDialog: React.FC<RenameTagDialogProps> = (props) => {
  const { destroy, tag } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleConfirmBtnClick = () => {
    const text = inputRef.current?.value;
    if (!text || text === tag.text) {
      destroy();
      return;
    }
    memoService
      .updateTagText(tag.id, text)
      .then(() => {
        memoService.clearMemos();
        memoService.fetchAllMemos();
        destroy();
      })
      .catch(() => {
        // do nth
      });
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🏷️</span>标签重命名
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <p className="tag-text">旧：{tag.text}</p>
        <input className="text-input" type="text" placeholder="输入新标签" ref={inputRef} />
        <div className="btns-container">
          <span className="btn-text cancel-btn" onClick={handleCloseBtnClick}>
            取消
          </span>
          <span className="btn-text confirm-btn" onClick={handleConfirmBtnClick}>
            确定
          </span>
        </div>
      </div>
    </>
  );
};

function showRenameTagDialog(tag: Tag): void {
  showDialog(
    {
      className: "rename-tag-dialog",
    },
    RenameTagDialog,
    {
      tag,
    }
  );
}

export default TagList;
