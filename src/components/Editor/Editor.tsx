import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "../../less/editor.less";

export interface EditorRefActions {
  focus: FunctionType;
  insertText: (text: string) => void;
  setContent: (text: string) => void;
  getContent: () => string;
}

interface EditorProps {
  className: string;
  content: string;
  placeholder: string;
  showConfirmBtn: boolean;
  handleConfirmBtnClick?: (content: string) => void;
  showCancelBtn: boolean;
  handleCancelBtnClick?: () => void;
  showTools: boolean;
  handleContentChange?: (content: string) => void;
  editorRef?: React.RefObject<EditorRefActions>;
}

const DEFAULT_EDITOR_PROPS: EditorProps = {
  className: "",
  content: "",
  placeholder: "",
  showConfirmBtn: true,
  showCancelBtn: false,
  showTools: false,
};

const Editor = forwardRef(function (props: EditorProps = DEFAULT_EDITOR_PROPS) {
  const {
    className,
    content: initialContent,
    placeholder,
    showConfirmBtn,
    showCancelBtn,
    showTools,
    handleConfirmBtnClick,
    handleCancelBtnClick,
    handleContentChange,
  } = props;
  const [content, setContent] = useState<string>(initialContent);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");

    if (content && editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, []);

  useImperativeHandle(props.editorRef, () => ({
    focus: () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    },
    insertText: (text: string) => {
      setContent(content + text);
      if (editorRef.current) {
        editorRef.current.innerHTML = content + text;
      }
      if (handleContentChange) {
        handleContentChange(content + text);
      }
    },
    setContent: (text: string) => {
      setContent(text);
      if (editorRef.current) {
        editorRef.current.innerHTML = text;
      }
    },
    getContent: (): string => {
      return content;
    },
  }));

  const handleInputerPasted = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const content = e.clipboardData.getData("text/plain");
    const divTemp = document.createElement("div");
    divTemp.innerHTML = content;
    document.execCommand("insertText", false, divTemp.innerText);
    divTemp.remove();

    if (handleContentChange) {
      handleContentChange(content);
    }
  };

  const handleInputerChanged = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setContent(content);

    if (handleContentChange) {
      handleContentChange(content);
    }
  };

  const handleCommonConfirmBtnClick = () => {
    if (handleConfirmBtnClick) {
      handleConfirmBtnClick(content);
      // 清空内容
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setContent("");
    }
  };

  const handleCommonCancelBtnClick = () => {
    if (handleCancelBtnClick) {
      handleCancelBtnClick();
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
        <div className="btns-right-container">
          {showCancelBtn ? (
            <button className="action-btn cancel-btn" disabled={content.length === 0} onClick={handleCommonCancelBtnClick}>
              撤销修改
            </button>
          ) : null}
          {showConfirmBtn ? (
            <button className="action-btn confirm-btn" disabled={content.length === 0} onClick={handleCommonConfirmBtnClick}>
              记下<span className="icon-text">✍️</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default Editor;
