import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../helpers/api";
import { TAG_REG } from "../helpers/consts";
import memoService from "../helpers/memoService";
import globalStateService from "../helpers/globalStateService";
import { historyService } from "../helpers/historyService";
import { utils } from "../helpers/utils";
import { storage } from "../helpers/storage";
import { toast } from "./Toast";
import { preferences } from "./PreferencesDialog";
import { Editor, EditorRefActions } from "./Editor/Editor";
import { formatMemoContent } from "./Memo";
import "../less/main-editor.less";

export const MainEditor: React.FunctionComponent = () => {
  const [content, setContent] = useState(getEditorContentCache());
  const [uponMemoId, setUponMemoId] = useState("");
  const [editMemoId, setEditMemoId] = useState("");
  const [uponMemoContent, setUponMemoContent] = useState("");
  const editorRef = React.useRef<EditorRefActions>(null);

  useEffect(() => {
    const ctx = {
      key: Date.now(),
    };

    const unsubscribeGlobalState = globalStateService.subscribe((nextState, prevState) => {
      if (nextState.uponMemoId && prevState.uponMemoId !== nextState.uponMemoId) {
        if (nextState.uponMemoId === nextState.editMemoId) {
          toast.info("不能 mark 自己呀");
          return;
        }

        if (nextState.uponMemoId === "") {
          setUponMemoId("");
          return;
        }

        const memo = memoService.getMemoById(nextState.uponMemoId);
        const uponMemoContent = utils.parseHTMLToRawString(formatMemoContent(memo?.content ?? ""));
        // this.editorConfig.editorRef?.current?.focus();
        setUponMemoId(nextState.uponMemoId);
        setUponMemoContent(uponMemoContent);
      }

      if (nextState.editMemoId && prevState.editMemoId !== nextState.editMemoId) {
        if (nextState.editMemoId === "") {
          setEditMemoId("");
          return;
        }

        const editMemo = memoService.getMemoById(nextState.editMemoId);

        if (editMemo) {
          setEditMemoId(nextState.editMemoId);
          editorRef.current?.setContent(editMemo.content ?? "");
          globalStateService.setUponMemoId(editMemo.uponMemoId ?? "");
        }
      }
    });

    historyService.bindStateChange(ctx, (query) => {
      const tagText = query.tag;

      if (tagText) {
        if (preferences.tagTextClickedAction === "insert") {
          const editorContent = editorRef.current?.getContent() ?? "";
          const text = `#${tagText}#`;
          if (!editorContent.includes(text)) {
            editorRef.current?.insertText(`#${tagText}#`);
          }
        } else {
          utils.copyTextToClipboard(`#${tagText}#`);
        }
      }
    });

    return () => {
      unsubscribeGlobalState();
      historyService.unbindStateListener(ctx);
    };
  }, []);

  const handleSaveBtnClick = useCallback(
    async (content: string) => {
      if (content === "") {
        toast.error("内容不能为空呀");
        return;
      }

      const tagTexts = utils.dedupe(Array.from(content.match(TAG_REG) ?? [])).map((t) => t.replaceAll(TAG_REG, "$1").trim());
      const tags: Model.Tag[] = [];

      // 保存标签
      for (const t of tagTexts) {
        const { data: tag } = await api.createTag(t);
        tags.push(tag);
      }

      if (editMemoId) {
        const newMemo = memoService.getMemoById(editMemoId);

        if (!newMemo || (newMemo.content === content && newMemo.uponMemoId === uponMemoId)) {
          // do nth
        } else {
          const prevTags = newMemo.tags ?? [];
          const prevTagTexts = prevTags.map((t) => t.text);

          for (const t of [...tags, ...prevTags]) {
            const tagText = t.text;

            if (!tagTexts.includes(tagText)) {
              api.removeMemoTag(newMemo.id, t.id);
            } else {
              if (!prevTagTexts.includes(tagText)) {
                api.createMemoTag(newMemo.id, t.id);
              }
            }
          }

          const { data: editedMemo } = await api.updateMemo(newMemo.id, content, uponMemoId);

          newMemo.content = editedMemo.content ?? "";
          newMemo.uponMemoId = editedMemo.uponMemoId ?? "";
          if (newMemo.uponMemoId) {
            newMemo.uponMemo = memoService.getMemoById(newMemo.uponMemoId);
          }
          newMemo.updatedAt = Date.now();
          memoService.__emit__();
        }
        setEditMemoId("");
      } else {
        const { data: newMemo } = await api.createMemo(content, uponMemoId);
        newMemo.tags = tags;
        if (uponMemoId) {
          newMemo.uponMemo = memoService.getMemoById(uponMemoId);
        }
        // link memo and tag
        for (const t of tags) {
          await api.createMemoTag(newMemo.id, t.id);
        }
        memoService.pushMemo(newMemo);
      }

      setContent("");
      setUponMemoId("");
      setEditorContentCache("");
    },
    [editMemoId, uponMemoId]
  );

  const handleCancelBtnClick = useCallback(() => {
    globalStateService.setEditMemoId("");
    editorRef.current?.setContent("");
    setContent("");
    setUponMemoId("");
    setEditorContentCache("");
  }, []);

  const handleContentChange = useCallback(
    (content: string) => {
      setContent(content);
      if (editMemoId === "") {
        setEditorContentCache(content);
      }
    },
    [editMemoId]
  );

  const handleClearUponMemoClick = () => {
    globalStateService.setUponMemoId("");
  };

  // 编辑器配置
  const editorConfig = useMemo(
    () => ({
      className: "main-editor",
      content: content,
      placeholder: "现在的想法是...",
      showConfirmBtn: true,
      handleConfirmBtnClick: handleSaveBtnClick,
      showCancelBtn: editMemoId === "" ? false : true,
      handleCancelBtnClick: handleCancelBtnClick,
      showTools: true,
      handleContentChange: handleContentChange,
      editorRef,
    }),
    [content, editMemoId, uponMemoId]
  );

  return (
    <div className={"main-editor-wrapper " + (editMemoId ? "edit-ing" : "")}>
      <p className={"tip-text " + (editMemoId ? "" : "hidden")}>正在修改中...</p>
      <Editor {...editorConfig} />
      <div className={"upon-memo-container " + (uponMemoId ? "" : "hidden")} onClick={handleClearUponMemoClick}>
        <img className="icon-img" src="/icons/magnet.svg" />
        <div className="upon-memo-content-text" dangerouslySetInnerHTML={{ __html: uponMemoContent }}></div>
      </div>
    </div>
  );
};

function getEditorContentCache(): string {
  return storage.get(["editorContentCache"]).editorContentCache ?? "";
}

function setEditorContentCache(content: string) {
  storage.set({
    editorContentCache: content,
  });
}
