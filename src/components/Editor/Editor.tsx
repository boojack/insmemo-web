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
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const refresh = useRefresh();

  useEffect(() => {
    if (initialContent) {
      editorRef.current!.value = initialContent;
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = "auto";
      editorRef.current.style.height = (editorRef.current.scrollHeight ?? 0) + "px";
    }
  }, [editorRef.current?.value]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        editorRef.current!.focus();
      },
      insertText: (rawText: string) => {
        if (editorRef.current!.value) {
          rawText = "\n" + rawText;
        }
        editorRef.current!.value += rawText;
        handleContentChangeCallback(editorRef.current!.value);
        refresh();
      },
      setContent: (text: string) => {
        editorRef.current!.value = parseHtmlToRawText(text);
        refresh();
      },
      getContent: (): string => {
        return editorRef.current?.value ?? "";
      },
    }),
    []
  );

  const handleEditorInput = useCallback(() => {
    handleContentChangeCallback(editorRef.current!.value);
    refresh();
  }, []);

  const handleEditorKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();

    if (event.code === "Enter") {
      if (event.metaKey || event.ctrlKey) {
        handleCommonConfirmBtnClick();
      }
    }
    refresh();
  }, []);

  const handleCommonConfirmBtnClick = useCallback(() => {
    handleConfirmBtnClickCallback(editorRef.current!.value);
    editorRef.current!.value = "";
    refresh();
  }, []);

  const handleCommonCancelBtnClick = useCallback(() => {
    handleCancelBtnClickCallback();
  }, []);

  return (
    <div className={"common-editor-wrapper " + className}>
      <textarea
        className="common-editor-inputer"
        rows={1}
        placeholder={placeholder}
        ref={editorRef}
        onInput={handleEditorInput}
        onKeyDown={handleEditorKeyDown}
      ></textarea>
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
            <button className="action-btn confirm-btn" disabled={editorRef.current?.value === ""} onClick={handleCommonConfirmBtnClick}>
              记下<span className="icon-text">✍️</span>
            </button>
          </Only>
        </div>
      </div>
    </div>
  );
});

export default Editor;
