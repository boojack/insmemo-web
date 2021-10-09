import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import Only from "../common/OnlyWhen";
import { parseHtmlToRawText } from "../../helpers/marked";
import useRefresh from "../../hooks/useRefresh";
import "../../less/editor.less";

export interface EditorRefActions {
  focus: FunctionType;
  insertText: (text: string) => void;
  setContent: (text: string) => void;
  getContent: () => string;
}

interface Props {
  className: string;
  initialContent: string;
  placeholder: string;
  showConfirmBtn: boolean;
  showCancelBtn: boolean;
  showTools: boolean;
  onConfirmBtnClick: (content: string) => void;
  onCancelBtnClick: () => void;
  onContentChange: (content: string) => void;
}

const Editor = forwardRef((props: Props, ref: React.ForwardedRef<EditorRefActions>) => {
  const {
    className,
    initialContent,
    placeholder,
    showConfirmBtn,
    showCancelBtn,
    showTools,
    onConfirmBtnClick: handleConfirmBtnClickCallback,
    onCancelBtnClick: handleCancelBtnClickCallback,
    onContentChange: handleContentChangeCallback,
  } = props;
  const editorRef = useRef<HTMLDivElement>(null);
  const refresh = useRefresh();

  useEffect(() => {
    if (initialContent) {
      editorRef.current!.innerHTML = initialContent;
    } else {
      editorRef.current!.innerHTML = "<br>";
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        editorRef.current!.focus();
      },
      insertText: (rawText: string) => {
        editorRef.current!.innerHTML += `<br>${rawText}`;
        handleContentChangeCallback(editorRef.current!.innerText);
        refresh();
      },
      setContent: (text: string) => {
        editorRef.current!.innerText = parseHtmlToRawText(text);
        refresh();
      },
      getContent: (): string => {
        return editorRef.current?.innerText ?? "";
      },
    }),
    []
  );

  const handleEditorPaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const text = event.clipboardData.getData("text");
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      return;
    }
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    event.preventDefault();
    handleContentChangeCallback(editorRef.current!.innerText);
    refresh();
  }, []);

  const handleEditorInput = useCallback(() => {
    handleContentChangeCallback(editorRef.current!.innerText);
    refresh();
  }, []);

  const handleEditorKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (event.key === "Tab") {
      event.preventDefault();
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        return;
      }
      selection.deleteFromDocument();
      const range = selection.getRangeAt(0);
      const tabTextNode = document.createTextNode("\t");
      range.insertNode(tabTextNode);
      range.setStartAfter(tabTextNode);
      range.setEndAfter(tabTextNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (event.key === "Backspace") {
      setTimeout(() => {
        if (editorRef.current?.innerText === "") {
          editorRef.current!.innerHTML = "<br>";
          refresh();
        }
      }, 0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const { lastElementChild, lastChild } = editorRef.current!;
      if (!lastElementChild || lastElementChild !== lastChild) {
        const brElement = document.createElement("br");
        editorRef.current?.appendChild(brElement);
      }
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) {
        return;
      }
      selection.deleteFromDocument();
      const range = selection.getRangeAt(0);
      const blankTextNode = document.createTextNode(" ");
      const brElement = document.createElement("br");
      range.insertNode(brElement);
      range.insertNode(blankTextNode);
      range.setStartAfter(brElement);
      range.setEndAfter(brElement);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    refresh();
  }, []);

  const handleCommonConfirmBtnClick = useCallback(() => {
    handleConfirmBtnClickCallback(editorRef.current?.innerText ?? "");
    editorRef.current!.innerHTML = "<br>";
    refresh();
  }, []);

  const handleCommonCancelBtnClick = useCallback(() => {
    handleCancelBtnClickCallback();
  }, []);

  const isEditorEmpty = Boolean(editorRef.current?.innerHTML === "<br>");

  return (
    <div className={"common-editor-wrapper " + className}>
      <div
        className="common-editor-inputer"
        contentEditable
        ref={editorRef}
        onPaste={handleEditorPaste}
        onInput={handleEditorInput}
        onKeyDown={handleEditorKeyDown}
      ></div>
      <p className={isEditorEmpty ? "common-editor-placeholder" : "hidden"}>{placeholder}</p>
      <div className="common-tools-wrapper">
        <Only when={showTools}>
          <div className={"common-tools-container"}>{/* nth */}</div>
        </Only>
        <div className="btns-right-container">
          <Only when={showCancelBtn}>
            <button className="action-btn cancel-btn" onClick={handleCommonCancelBtnClick}>
              撤销修改
            </button>
          </Only>
          <Only when={showConfirmBtn}>
            <button className="action-btn confirm-btn" disabled={isEditorEmpty} onClick={handleCommonConfirmBtnClick}>
              记下<span className="icon-text">✍️</span>
            </button>
          </Only>
        </div>
      </div>
    </div>
  );
});

export default Editor;
