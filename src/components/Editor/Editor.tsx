import React, { useRef, useState } from "react";
import "../../less/editor.less";

export interface EditorProps {
  className: string;
  content: string;
  placeholder: string;
  showConfirmBtn: boolean;
  handleConfirmBtnClick?: (content: string) => void;
  showTools: boolean;
}

const DEFAULT_EDITOR_PROPS: EditorProps = {
  className: "",
  content: "",
  placeholder: "",
  showConfirmBtn: true,
  showTools: false,
};

export function Editor(props: EditorProps = DEFAULT_EDITOR_PROPS) {
  const { className, content: initialContent, placeholder, showConfirmBtn, showTools, handleConfirmBtnClick } = props;
  const [content, setContent] = useState<string>(initialContent);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInputerPasted = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const content = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, content);
  };

  const handleInputerChanged = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setContent(content);
  };

  const handleSaveBtnClick = () => {
    if (handleConfirmBtnClick) {
      handleConfirmBtnClick(content);
    }
  };

  return (
    <div className={"common-editor-wrapper " + className}>
      <div
        className="common-editor-inputer"
        contentEditable
        ref={editorRef}
        onPaste={handleInputerPasted}
        onInput={handleInputerChanged}
      ></div>
      <p className={content === "" ? "common-editor-placeholder" : "hidden"}>{placeholder}</p>
      <div className="common-tools-wrapper">
        {showTools ? <div className={"common-tools-container"}>{/* nth */}</div> : null}
        {showConfirmBtn ? (
          <button className={"confirm-btn " + (content === "" ? "disabled" : "")} onClick={handleSaveBtnClick}>
            记下✍️
          </button>
        ) : null}
      </div>
    </div>
  );
}
