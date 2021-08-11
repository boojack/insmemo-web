import React, { useEffect, useState } from "react";
import { storage } from "../helpers/storage";
import { showDialog } from "./Dialog";
import { memoService } from "../services";
import "../less/preferences-dialog.less";

interface Props extends DialogProps {}

/**
 * 设置选项：
 * 1. 中英文分开；
 * 2. markdown 解析；
 */
const PreferencesDialog: React.FC<Props> = ({ destroy }) => {
  const preferences = storage.preferences;
  const [shouldSplitMemoWord, setShouldSplitWord] = useState<boolean>(preferences.shouldSplitMemoWord);
  const [shouldHideImageUrl, setHideImageUrl] = useState<boolean>(preferences.shouldHideImageUrl);
  const [tagTextClickedAction, setTagTextClickedAction] = useState<"copy" | "insert">(preferences.tagTextClickedAction);
  const [shouldUseMarkdownParser, setShouldUseMarkdownParser] = useState<boolean>(preferences.shouldUseMarkdownParser);
  const [showDarkMode, setShowDarkMode] = useState<boolean>(preferences.showDarkMode);

  useEffect(() => {
    // do nth
  }, []);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleSplitWordsValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    setShouldSplitWord(nextStatus);
    preferences.shouldSplitMemoWord = nextStatus;
    storage.set({ shouldSplitMemoWord: nextStatus });
    storage.emitStorageChangedEvent();
  };

  const handleHideImageUrlValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    setHideImageUrl(nextStatus);
    preferences.shouldHideImageUrl = nextStatus;
    storage.set({ shouldHideImageUrl: nextStatus });
    storage.emitStorageChangedEvent();
  };

  const handleShowDarkModeValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    setShowDarkMode(nextStatus);
    preferences.showDarkMode = nextStatus;
    storage.set({ showDarkMode: nextStatus });
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

  const handleExportBtnClick = async () => {
    while (true) {
      const memos = await memoService.fetchMoreMemos();
      if (!memos || memos.length === 0) {
        break;
      }
    }

    const formatedMemos = memoService.getState().memos.map((m) => {
      return {
        ...m,
        tags: m.tags.map((t) => t.text),
      };
    });

    const jsonStr = JSON.stringify(formatedMemos);
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(jsonStr));
    element.setAttribute("download", "data.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
        <div className="section-container preferences-section-container">
          <p className="title-text">常规</p>
          <label className="form-label checkbox-form-label">
            <span className="normal-text">深色模式</span>
            <img className="icon-img" src={showDarkMode ? "/icons/check-active.svg" : "/icons/check.svg"} />
            <input className="hidden" type="checkbox" checked={showDarkMode} onChange={handleShowDarkModeValueChanged} />
            <span className="tip-text">😜先用着吧</span>
          </label>
        </div>
        <div className="section-container preferences-section-container">
          <p className="title-text">
            Memo 显示相关 <span className="tip-text">需要主动刷新网页</span>
          </p>
          <label className="form-label checkbox-form-label">
            <span className="normal-text">中英文内容自动间隔</span>
            <img className="icon-img" src={shouldSplitMemoWord ? "/icons/check-active.svg" : "/icons/check.svg"} />
            <input className="hidden" type="checkbox" checked={shouldSplitMemoWord} onChange={handleSplitWordsValueChanged} />
          </label>
          <label className="form-label checkbox-form-label">
            <span className="normal-text">隐藏图片链接地址</span>
            <img className="icon-img" src={shouldHideImageUrl ? "/icons/check-active.svg" : "/icons/check.svg"} />
            <input className="hidden" type="checkbox" checked={shouldHideImageUrl} onChange={handleHideImageUrlValueChanged} />
          </label>
          <label className="form-label checkbox-form-label">
            <span className="normal-text">使用 markdown 解析</span>
            <img className="icon-img" src={shouldUseMarkdownParser ? "/icons/check-active.svg" : "/icons/check.svg"} />
            <input className="hidden" type="checkbox" checked={shouldUseMarkdownParser} onChange={handleUseMarkdownParserChanged} />
            <span className="tip-text">目前支持列表、代码块</span>
          </label>
        </div>
        <div className="section-container">
          <p className="title-text">动作相关</p>
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
        </div>

        <div className="section-container">
          <p className="title-text">其他</p>
          <div className="btn-container">
            <button className="btn export-btn" onClick={handleExportBtnClick}>
              导出数据
            </button>
          </div>
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
