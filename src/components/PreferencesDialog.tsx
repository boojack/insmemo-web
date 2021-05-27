import React, { useEffect, useState } from "react";
import { storage } from "../helpers/storage";
import { DialogProps, showDialog } from "./Dialog";
import CloseIcon from "../assets/icons/close.svg";
import CheckIcon from "../assets/icons/check.svg";
import CheckActiveIcon from "../assets/icons/check-active.svg";
import RadioIcon from "../assets/icons/radio.svg";
import RadioActiveIcon from "../assets/icons/radio-active.svg";
import "../less/preferences-dialog.less";

interface Props extends DialogProps {}

/**
 * 设置选项：
 * 1. 中英文分开；
 * 2. todo
 */
export const preferences = storage.get(["shouldSplitMemoWord", "tagTextClickedAction"]);

const PreferencesDialog: React.FunctionComponent<Props> = (props) => {
  const [shouldSplitMemoWord, setShouldSplitWord] = useState<boolean>(preferences.shouldSplitMemoWord ?? false);
  const [tagTextClickedAction, setTagTextClickedAction] = useState<"copy" | "insert">(preferences.tagTextClickedAction ?? "copy");

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
          <img className="icon-img" src={CloseIcon} />
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
            <img className="icon-img" src={shouldSplitMemoWord ? CheckActiveIcon : CheckIcon} />
            <input className="hidden" type="checkbox" checked={shouldSplitMemoWord} onChange={handleSplitWordsValueChanged} />
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
              <img className="icon-img" src={tagTextClickedAction === "copy" ? RadioActiveIcon : RadioIcon} />
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
              <img className="icon-img" src={tagTextClickedAction === "insert" ? RadioActiveIcon : RadioIcon} />
              <span>加入编辑器</span>
            </label>
          </label>
          <p className="tip-text">...to be continue</p>
        </div>
      </div>
    </>
  );
};

export function showPreferencesDialog() {
  showDialog(
    {
      className: "preferences-dialog",
    },
    PreferencesDialog,
    {}
  );
}
