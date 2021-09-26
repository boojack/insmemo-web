import React, { useContext, useEffect } from "react";
import appContext from "../labs/appContext";
import { showDialog } from "./Dialog";
import { globalStateService, memoService } from "../services";
import "../less/preferences-dialog.less";

interface Props extends DialogProps {}

/**
 * 设置选项：
 * 1. 中英文分开；
 * 2. markdown 解析；
 */
const PreferencesDialog: React.FC<Props> = ({ destroy }) => {
  const {
    globalState: { shouldHideImageUrl, shouldSplitMemoWord, shouldUseMarkdownParser, showDarkMode, tagTextClickedAction },
  } = useContext(appContext);

  useEffect(() => {
    // do nth
  }, []);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleSplitWordsValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    globalStateService.setAppSetting({
      shouldSplitMemoWord: nextStatus,
    });
  };

  const handleHideImageUrlValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    globalStateService.setAppSetting({
      shouldHideImageUrl: nextStatus,
    });
  };

  const handleShowDarkModeValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    globalStateService.setAppSetting({
      showDarkMode: nextStatus,
    });
  };

  const handleUseMarkdownParserChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    globalStateService.setAppSetting({
      shouldUseMarkdownParser: nextStatus,
    });
  };

  const handleTagTextClickValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.value as "copy" | "insert";
    globalStateService.setAppSetting({
      tagTextClickedAction: nextStatus,
    });
  };

  const handleExportBtnClick = async () => {
    await memoService.fetchAllMemos();
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
          </label>
        </div>
        <div className="section-container preferences-section-container">
          <p className="title-text">Memo 显示相关</p>
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
      useAppContext: true,
    },
    PreferencesDialog
  );
}
