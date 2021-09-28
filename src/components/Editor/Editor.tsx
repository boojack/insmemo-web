import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
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

const Editor = (props: EditorProps = DEFAULT_EDITOR_PROPS) => {
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

  const handleInputerPasted = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const text = event.clipboardData.getData("text");
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      return;
    }
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    event.preventDefault();
    setContent(text);
    if (handleContentChange) {
      handleContentChange(text);
    }
  }, []);

  const handleInputerChanged = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setContent(content);

    if (handleContentChange) {
      handleContentChange(content);
    }
  }, []);

  const handleInputerKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (event.key === "Tab") {
      event.preventDefault();
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        return;
      }
      selection.deleteFromDocument();
      const range = selection.getRangeAt(0);
      const spaceNode = document.createTextNode("    ");
      range.insertNode(spaceNode);
      range.setEndAfter(spaceNode);
      range.setStartAfter(spaceNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (event.key === "Backspace") {
      if (editorRef.current && editorRef.current.innerHTML === "<br>") {
        editorRef.current.innerHTML = "";
        setContent("");
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        return;
      }
      selection.deleteFromDocument();
      const range = selection.getRangeAt(0);
      const pElement = document.createElement("p");
      const brElement = document.createElement("br");
      pElement.appendChild(brElement);
      range.insertNode(pElement);
      range.setEndAfter(brElement);
      range.setStartAfter(brElement);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  const handleCommonConfirmBtnClick = useCallback(() => {
    if (handleConfirmBtnClick) {
      handleConfirmBtnClick(content);
      // 清空内容
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
      setContent("");
    }
  }, [content]);

  const handleCommonCancelBtnClick = useCallback(() => {
    if (handleCancelBtnClick) {
      handleCancelBtnClick();
    }
  }, []);

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
};

export default forwardRef(Editor);
