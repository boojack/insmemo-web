import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Only from "../common/OnlyWhen";
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

const Editor = forwardRef((props: EditorProps = DEFAULT_EDITOR_PROPS) => {
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
      editorRef.current?.focus();
    },
    insertText: (rawText: string) => {
      const text = content + rawText;
      setContent(text);
      if (editorRef.current) {
        editorRef.current.innerHTML = text;
      }
      if (handleContentChange) {
        handleContentChange(text);
      }
    },
    setContent: (rawText: string) => {
      const text = rawText;
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
  };

  const handleInputerChanged = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setContent(content);

    if (handleContentChange) {
      handleContentChange(content);
    }
  };

  const handleInputerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, "  ");
    } else if (e.key === "Backspace") {
      if (editorRef.current?.innerHTML === "<br>") {
        setContent("");
      }
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
        onKeyDown={handleInputerKeyDown}
      ></div>
      <p className={content === "" ? "common-editor-placeholder" : "hidden"}>{placeholder}</p>
      <div className="common-tools-wrapper">
        <Only when={showTools}>
          <div className={"common-tools-container"}>{/* nth */}</div>
        </Only>
        <div className="btns-right-container">
          <Only when={showCancelBtn}>
            <button className="action-btn cancel-btn" disabled={content.length === 0} onClick={handleCommonCancelBtnClick}>
              撤销修改
            </button>
          </Only>
          <Only when={showConfirmBtn}>
            <button className="action-btn confirm-btn" disabled={content.length === 0} onClick={handleCommonConfirmBtnClick}>
              记下<span className="icon-text">✍️</span>
            </button>
          </Only>
        </div>
      </div>
    </div>
  );
});

export default Editor;
