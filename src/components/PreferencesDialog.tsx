import React, { useEffect, useState } from "react";
import { storage } from "../helpers/storage";
import { showDialog } from "./Dialog";
import "../less/preferences-dialog.less";

interface Props extends DialogProps {}

/**
 * 设置选项：
 * 1. 中英文分开；
 * 2. markdown 解析；
 */
const cachePrefers = storage.get(["shouldSplitMemoWord", "tagTextClickedAction", "shouldUseMarkdownParser"]);
export const preferences = {
  shouldSplitMemoWord: cachePrefers.shouldSplitMemoWord ?? false,
  shouldUseMarkdownParser: cachePrefers.shouldUseMarkdownParser ?? false,
  tagTextClickedAction: cachePrefers.tagTextClickedAction ?? "copy",
};
storage.set({ ...preferences });

const PreferencesDialog: React.FunctionComponent<Props> = (props) => {
  const [shouldSplitMemoWord, setShouldSplitWord] = useState<boolean>(preferences.shouldSplitMemoWord);
  const [tagTextClickedAction, setTagTextClickedAction] = useState<"copy" | "insert">(preferences.tagTextClickedAction);
  const [shouldUseMarkdownParser, setShouldUseMarkdownParser] = useState<boolean>(preferences.shouldUseMarkdownParser);

  useEffect(() => {
    // do nth
  }, []);

  const handleCloseBtnClick = () => {
    props.destroy();
  };

  const handleSplitWordsValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    setShouldSplitWord(nextStatus);
    preferences.shouldSplitMemoWord = nextStatus;
    storage.set({ shouldSplitMemoWord: nextStatus });
    storage.emitStorageChangedEvent();
  };

  const handleUseMarkdownParserChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    setShouldUseMarkdownParser(nextStatus);
    preferences.shouldUseMarkdownParser = nextStatus;
    storage.set({ shouldUseMarkdownParser: nextStatus });
    storage.emitStorageChangedEvent();
  };

  const handleTagTextClickValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.value as "copy" | "insert";
    setTagTextClickedAction(nextStatus);
    preferences.tagTextClickedAction = nextStatus;
    storage.set({ tagTextClickedAction: nextStatus });
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🤟</span>偏好设置
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <div className="section-container account-section-container">
          <p className="title-text">账号设置</p>
          <p className="tip-text">waiting to start</p>
        </div>
        <div className="section-container preferences-section-container">
          <p className="title-text">特殊设置</p>
          <label className="form-label checkbox-form-label">
            <span className="normal-text">中英文之间加空格</span>
            <img className="icon-img" src={shouldSplitMemoWord ? "/icons/check-active.svg" : "/icons/check.svg"} />
            <input className="hidden" type="checkbox" checked={shouldSplitMemoWord} onChange={handleSplitWordsValueChanged} />
          </label>
          <label className="form-label checkbox-form-label">
            <span className="normal-text">使用 markdown 解析</span>
            <img className="icon-img" src={shouldUseMarkdownParser ? "/icons/check-active.svg" : "/icons/check.svg"} />
            <input className="hidden" type="checkbox" checked={shouldUseMarkdownParser} onChange={handleUseMarkdownParserChanged} />
          </label>
          <label className="form-label checkbox-form-label">
            <span className="normal-text">标签点击处理:</span>
            <label className="form-label">
              <input
                className="hidden"
                type="radio"
                value="copy"
                checked={tagTextClickedAction === "copy"}
                onChange={handleTagTextClickValueChanged}
              />
              <img className="icon-img" src={tagTextClickedAction === "copy" ? "/icons/radio-active.svg" : "/icons/radio.svg"} />
              <span>复制文字</span>
            </label>
            <label className="form-label">
              <input
                className="hidden"
                type="radio"
                value="insert"
                checked={tagTextClickedAction === "insert"}
                onChange={handleTagTextClickValueChanged}
              />
              <img className="icon-img" src={tagTextClickedAction === "insert" ? "/icons/radio-active.svg" : "/icons/radio.svg"} />
              <span>加入编辑器</span>
            </label>
          </label>
          <p className="tip-text">...to be continue</p>
        </div>
      </div>
    </>
  );
};

export default function showPreferencesDialog() {
  showDialog(
    {
      className: "preferences-dialog",
    },
    PreferencesDialog,
    {}
  );
}
