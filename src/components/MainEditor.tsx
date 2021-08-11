import React, { useCallback, useEffect, useMemo, useState } from "react";
import { globalStateStore, locationStore } from "../stores";
import { globalStateService, locationService, memoService } from "../services";
import useSelector from "../hooks/useSelector";
import { utils } from "../helpers/utils";
import { storage } from "../helpers/storage";
import toast from "./Toast";
import Editor, { EditorRefActions } from "./Editor/Editor";
import "../less/main-editor.less";

const MainEditor: React.FC = () => {
  const globalState = useSelector(globalStateStore);
  const { query } = useSelector(locationStore);
  const editorRef = React.useRef<EditorRefActions>(null);
  const [editMemoId, setEditMemoId] = useState(globalState.editMemoId);

  useEffect(() => {
    // Mark memo
    if (globalState.markMemoId) {
      const memoLinkText = `Mark: [@MEMO](${globalState.markMemoId})`;
      editorRef.current?.insertText(`<p>${memoLinkText}</p>`);
    }

    // Edit memo
    if (globalState.editMemoId !== editMemoId) {
      setEditMemoId(globalState.editMemoId);
      if (globalState.editMemoId) {
        memoService.getMemoById(globalState.editMemoId).then((editMemo) => {
          if (editMemo) {
            editorRef.current?.setContent(editMemo.content ?? "");
            editorRef.current?.focus();
          }
        });
      }
    }
  }, [globalState]);

  useEffect(() => {
    const tagText = query.tag;

    if (tagText) {
      if (storage.preferences.tagTextClickedAction === "insert") {
        const editorContent = editorRef.current?.getContent() ?? "";
        const text = `#${tagText}#`;
        if (!editorContent.includes(text)) {
          editorRef.current?.insertText(`#${tagText}#`);
        }
      } else {
        utils.copyTextToClipboard(`#${tagText}#`);
      }
    }
  }, [query]);

  const handleSaveBtnClick = async (content: string) => {
    if (content === "") {
      toast.error("内容不能为空呀");
      return;
    }

    // 标签 正则
    const TAG_REG = /#(.+?)#/g;
    const tagTexts = utils.dedupe(Array.from(content.match(TAG_REG) ?? [])).map((t) => t.replace(TAG_REG, "$1").trim());
    const tags: Model.Tag[] = [];

    // 保存标签
    for (const t of tagTexts) {
      const tag = await memoService.createTag(t);
      tags.push(tag);
    }

    if (editMemoId) {
      const prevMemo = await memoService.getMemoById(editMemoId);

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
            memoService.removeMemoTag(prevMemo.id, t.id);
          } else {
            i++;
            if (!prevTagTexts.includes(tagText)) {
              memoService.createMemoTag(prevMemo.id, t.id);
            }
          }
        }

        const editedMemo = await memoService.updateMemo(prevMemo.id, content);

        prevMemo.tags = tags;
        prevMemo.content = editedMemo.content ?? "";
        prevMemo.updatedAt = Date.now();
        memoService.editMemo(prevMemo);
      }
      globalStateService.setEditMemoId("");
    } else {
      const newMemo = await memoService.createMemo(content);

      newMemo.tags = tags;

      // link memo and tag
      for (const t of tags) {
        await memoService.createMemoTag(newMemo.id, t.id);
      }
      const tagQuery = query.tag;
      if (tagQuery !== "" && !tagTexts.includes(tagQuery)) {
        locationService.setTagQuery("");
      }
      memoService.pushMemo(newMemo);
    }

    setEditorContentCache("");
  };

  const handleCancelBtnClick = useCallback(() => {
    globalStateService.setEditMemoId("");
    editorRef.current?.setContent("");
    setEditorContentCache("");
  }, []);

  const handleContentChange = useCallback(
    async (content: string) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      if (tempDiv.innerText.trim() === "") {
        content = "";
      }
      setEditorContentCache(content);
    },
    [editMemoId]
  );

  // 编辑器配置
  const editorConfig = useMemo(
    () => ({
      className: "main-editor",
      content: getEditorContentCache(),
      placeholder: "现在的想法是...",
      showConfirmBtn: true,
      handleConfirmBtnClick: handleSaveBtnClick,
      showCancelBtn: editMemoId === "" ? false : true,
      handleCancelBtnClick: handleCancelBtnClick,
      showTools: true,
      handleContentChange: handleContentChange,
      editorRef,
    }),
    [editMemoId]
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
