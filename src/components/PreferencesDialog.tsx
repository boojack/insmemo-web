import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { storage } from "../helpers/storage";
import "../less/preferences-dialog.less";

interface Props {
  destory: FunctionType;
}

/**
 * 设置选项：
 * 1. 中英文分开；
 * 2. todo
 */
export const preferences = storage.get(["shouldSplitMemoWord"]);

function PreferencesDialog(props: Props) {
  const [shouldSplitMemoWord, setShouldSplitWord] = useState<boolean>(preferences.shouldSplitMemoWord ?? false);

  useEffect(() => {
    // do nth
  }, []);

  const handleCloseBtnClick = () => {
    props.destory();
  };

  const handleSplitWordsValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStatus = e.target.checked;
    setShouldSplitWord(nextStatus);
    preferences.shouldSplitMemoWord = nextStatus;
    storage.set({ shouldSplitMemoWord: nextStatus });
    storage.emitStorageChangedEvent();
  };

  return (
    <div className="dialog-wrapper preferences-dialog">
      <div className="dialog-container">
        <div className="dialog-header-container">
          <p className="title-text">🤟 偏好设置</p>
          <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
            ✖️
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
              <input type="checkbox" checked={shouldSplitMemoWord} onChange={handleSplitWordsValueChanged} />
            </label>
            {/* <label className="form-label checkbox-form-label">
              <span className="normal-text">缓存输入</span>
              <input type="checkbox" checked={shouldSplitMemoWord} onChange={handleSplitWordsValueChanged} />
            </label> */}
            {/* <label className="form-label checkbox-form-label">
              <span className="normal-text">点击标签动作</span>
              <label className="form-label">
                <input type="radio" name="tag-text-click" />
                <span>复制文字</span>
              </label>
              <label className="form-label">
                <input type="radio" name="tag-text-click" />
                <span>加入编辑器</span>
              </label>
            </label> */}
            <p className="tip-text">...to be continue</p>
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
