import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { storage } from "../helpers/storage";
import { toast } from "./Toast";
import "../less/preferences-dialog.less";

interface Props {
  destory: FunctionType;
}

/**
 * 设置选项：
 * 1. 中英文分开；
 * 2.
 */
function PreferencesDialog(props: Props) {
  const [shouldSplitMemoWord, setShouldSplitWord] = useState(false);
  const [shouldMaxMemoHeight, setShouldMaxHeight] = useState(false);

  useEffect(() => {
    const { shouldSplitMemoWord, shouldMaxMemoHeight } = storage.get(["shouldSplitMemoWord", "shouldMaxMemoHeight"]);

    if (shouldSplitMemoWord !== undefined) {
      setShouldSplitWord(shouldSplitMemoWord);
    }

    if (shouldMaxMemoHeight !== undefined) {
      setShouldMaxHeight(shouldMaxMemoHeight);
    }
  }, []);

  const handleCloseBtnClick = () => {
    props.destory();
  };

  const handleSplitWordsValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    setShouldSplitWord(nextStatus);
    storage.set({ shouldSplitMemoWord: nextStatus });
    toast.info("刷新后才能看到效果哦~");
  };

  const handleMaxHeightValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    setShouldMaxHeight(nextStatus);
    storage.set({ shouldMaxMemoHeight: nextStatus });
  };

  return (
    <div className="dialog-wrapper preferences-dialog">
      <div className="dialog-container">
        <div className="dialog-header-container">
          <p className="title-text">偏好设置</p>
          <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
            ✖️
          </button>
        </div>
        <div className="dialog-content-container">
          <div className="section-container account-section-container">
            <p className="title-text">账号设置</p>
            <p className="tip-text">to be continue</p>
            {/* <label className="checkbox-form-label">
              <input type="checkbox" checked={shouldSplitMemoWord} onChange={handleSplitWordsValueChanged} />
              <span>中英文之间加空格</span>
            </label> */}
          </div>
          <div className="section-container preferences-section-container">
            <p className="title-text">偏好设置</p>
            <label className="checkbox-form-label">
              <input type="checkbox" checked={shouldSplitMemoWord} onChange={handleSplitWordsValueChanged} />
              <span>中英文之间加空格</span>
            </label>
            {/* <label className="checkbox-form-label">
              <input type="checkbox" checked={shouldMaxMemoHeight} disabled onChange={handleMaxHeightValueChanged} />
              <span>Memo 过长折叠</span>
            </label> */}
          </div>
        </div>
        <div className="dialog-footer-container"></div>
      </div>
    </div>
  );
}

export function showPreferencesDialog() {
  const div = document.createElement("div");
  document.body.append(div);

  const destory = () => {
    ReactDOM.unmountComponentAtNode(div);
    div.remove();
  };
  ReactDOM.render(<PreferencesDialog destory={destory} />, div);
}
