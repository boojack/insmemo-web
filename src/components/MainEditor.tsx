import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../helpers/api";
import memoService from "../helpers/memoService";
import globalStateService from "../helpers/globalStateService";
import locationService from "../helpers/locationService";
import { utils } from "../helpers/utils";
import { storage } from "../helpers/storage";
import toast from "./Toast";
import { preferences } from "./PreferencesDialog";
import Editor, { EditorRefActions } from "./Editor/Editor";
import "../less/main-editor.less";

// 标签 正则
const TAG_REG = /#(.+?)#/g;

const MainEditor: React.FunctionComponent = () => {
  const [content, setContent] = useState(getEditorContentCache());
  const [editMemoId, setEditMemoId] = useState("");
  const editorRef = React.useRef<EditorRefActions>(null);

  useEffect(() => {
    const unsubscribeGlobalState = globalStateService.subscribe((nextState, prevState) => {
      if (nextState.markMemoId !== "" && memoService.getMemoById(nextState.markMemoId)) {
        const memoLinkText = `[@MEMO](${nextState.markMemoId})`;
        editorRef.current?.insertText(`${memoLinkText}\n`);
      }

      if (nextState.editMemoId !== prevState.editMemoId) {
        if (nextState.editMemoId === "") {
          setEditMemoId("");
          return;
        }

        const editMemo = memoService.getMemoById(nextState.editMemoId);

        if (editMemo) {
          setEditMemoId(nextState.editMemoId);
          editorRef.current?.setContent(editMemo.content ?? "");
        }
      }
    });

    const unsubscribeLocationService = locationService.subscribe(({ query }) => {
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
      unsubscribeLocationService();
    };
  }, []);

  const handleSaveBtnClick = useCallback(
    async (content: string) => {
      if (content === "") {
        toast.error("内容不能为空呀");
        return;
      }

      const tagTexts = utils.dedupe(Array.from(content.match(TAG_REG) ?? [])).map((t) => t.replace(TAG_REG, "$1").trim());
      const tags: Model.Tag[] = [];

      // 保存标签
      for (const t of tagTexts) {
        const { data: tag } = await api.createTag(t);
        tags.push(tag);
      }

      if (editMemoId) {
        const prevMemo = memoService.getMemoById(editMemoId);

        if (!prevMemo || prevMemo.content === content) {
          // do nth
        } else {
          const prevTags = prevMemo.tags ?? [];
          const prevTagTexts = prevTags.map((t) => t.text);
          tags.push(...prevTags);

          for (let i = 0; i < tags.length; ) {
            const t = tags[i];
            const tagText = t.text;

            if (!tagTexts.includes(tagText)) {
              tags.splice(i, 1);
              api.removeMemoTag(prevMemo.id, t.id);
            } else {
              i++;
              if (!prevTagTexts.includes(tagText)) {
                api.createMemoTag(prevMemo.id, t.id);
              }
            }
          }

          const { data: editedMemo } = await api.updateMemo(prevMemo.id, content);

          prevMemo.tags = tags;
          prevMemo.content = editedMemo.content ?? "";
          prevMemo.updatedAt = Date.now();
          memoService.editMemo(prevMemo);
        }
        globalStateService.setEditMemoId("");
      } else {
        const { data: newMemo } = await api.createMemo(content);

        newMemo.tags = tags;

        // link memo and tag
        for (const t of tags) {
          await api.createMemoTag(newMemo.id, t.id);
        }
        const tagQuery = locationService.getState().query.tag;
        if (tagQuery !== "" && !tagTexts.includes(tagQuery)) {
          locationService.setTagQuery("");
        }
        memoService.pushMemo(newMemo);
      }

      setContent("");
      setEditorContentCache("");
    },
    [editMemoId]
  );

  const handleCancelBtnClick = useCallback(() => {
    globalStateService.setEditMemoId("");
    editorRef.current?.setContent("");
    setContent("");
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
    [content, editMemoId]
  );

  return (
    <div className={"main-editor-wrapper " + (editMemoId ? "edit-ing" : "")}>
      <p className={"tip-text " + (editMemoId ? "" : "hidden")}>正在修改中...</p>
      <Editor {...editorConfig} />
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

export default MainEditor;
