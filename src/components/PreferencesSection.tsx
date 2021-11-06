import { useContext, useEffect, useRef } from "react";
import appContext from "../labs/appContext";
import { globalStateService, memoService } from "../services";
import { formatMemoContent } from "./Memo";
import "../less/preferences-section.less";

interface Props {}

const PreferencesSection: React.FC<Props> = () => {
  const { globalState } = useContext(appContext);
  const { shouldHideImageUrl, shouldSplitMemoWord, shouldUseMarkdownParser } = globalState;

  const demoContentElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (demoContentElRef.current) {
      const tempDiv = formatMemoContent(`👋 你好呀～\n我是一个demo：\n* 👏 欢迎使用memos；`);
      demoContentElRef.current.innerHTML = "";
      demoContentElRef.current.append(...tempDiv.children);
    }
  }, [globalState]);

  const handleSplitWordsValueChanged = () => {
    globalStateService.setAppSetting({
      shouldSplitMemoWord: !shouldSplitMemoWord,
    });
  };

  const handleHideImageUrlValueChanged = () => {
    globalStateService.setAppSetting({
      shouldHideImageUrl: !shouldHideImageUrl,
    });
  };

  const handleUseMarkdownParserChanged = () => {
    globalStateService.setAppSetting({
      shouldUseMarkdownParser: !shouldUseMarkdownParser,
    });
  };

  const handleExportBtnClick = async () => {
    const formatedMemos = memoService.getState().memos.map((m) => {
      return {
        ...m,
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
      <div className="section-container preferences-section-container">
        <p className="title-text">Memo 显示相关</p>
        <div className="demo-content-container memo-content-text" ref={demoContentElRef}></div>
        <label className="form-label checkbox-form-label" onClick={handleSplitWordsValueChanged}>
          <span className="normal-text">中英文内容自动间隔</span>
          <img className="icon-img" src={shouldSplitMemoWord ? "/icons/checkbox-active.svg" : "/icons/checkbox.svg"} />
        </label>
        <label className="form-label checkbox-form-label" onClick={handleUseMarkdownParserChanged}>
          <span className="normal-text">部分 markdown 格式解析</span>
          <img className="icon-img" src={shouldUseMarkdownParser ? "/icons/checkbox-active.svg" : "/icons/checkbox.svg"} />
        </label>
        <label className="form-label checkbox-form-label" onClick={handleHideImageUrlValueChanged}>
          <span className="normal-text">隐藏图片链接地址</span>
          <img className="icon-img" src={shouldHideImageUrl ? "/icons/checkbox-active.svg" : "/icons/checkbox.svg"} />
        </label>
      </div>
      <div className="section-container hidden">
        <p className="title-text">其他</p>
        <div className="btn-container">
          <button className="btn export-btn" onClick={handleExportBtnClick}>
            导出数据(JSON)
          </button>
        </div>
      </div>
    </>
  );
};

export default PreferencesSection;
