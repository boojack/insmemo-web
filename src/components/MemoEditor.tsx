import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { globalStateService, locationService, memoService } from "../services";
import { TAG_REG } from "../helpers/consts";
import appContext from "../labs/appContext";
import { parseHtmlToRawText } from "../helpers/marked";
import { utils } from "../helpers/utils";
import { storage } from "../helpers/storage";
import toastHelper from "./Toast";
import Editor, { EditorRefActions } from "./Editor/Editor";
import "../less/memo-editor.less";

interface Props {}

const MemoEditor: React.FC<Props> = () => {
  const { globalState } = useContext(appContext);
  const editorRef = useRef<EditorRefActions>(null);

  useEffect(() => {
    // Mark memo
    if (globalState.markMemoId) {
      const memoLinkText = `Mark: [@MEMO](${globalState.markMemoId})`;
      editorRef.current?.insertText(memoLinkText);
    }

    // Edit memo
    if (globalState.editMemoId) {
      memoService.getMemoById(globalState.editMemoId).then((editMemo) => {
        if (editMemo) {
          editorRef.current?.setContent(editMemo.content ?? "");
          editorRef.current?.focus();
        }
      });
    }
  }, [globalState]);

  const handleSaveBtnClick = useCallback(async (content: string) => {
    if (content === "") {
      toastHelper.error("内容不能为空呀");
      return;
    }

    const { editMemoId } = globalStateService.getState();
    const { query } = locationService.getState();

    content = parseHtmlToRawText(content.replaceAll("&nbsp;", " "));

    const tagTexts = utils.dedupe(Array.from(content.match(TAG_REG) ?? [])).map((t) => t.replace(TAG_REG, "$1").trim());
    const tags: Model.Tag[] = [];

    try {
      // 保存标签
      for (const t of tagTexts) {
        const tag = await memoService.createTag(t);
        tags.push(tag);
      }

      if (editMemoId) {
        const prevMemo = await memoService.getMemoById(editMemoId);

        if (prevMemo && prevMemo.content !== content) {
          const prevTags = prevMemo.tags ?? [];
          const prevTagTexts = prevTags.map((t) => t.text);
          tags.push(...prevTags);

          for (let i = 0; i < tags.length; ) {
            const t = tags[i];
            const tagText = t.text;

            if (!tagTexts.includes(tagText)) {
              tags.splice(i, 1);
              await memoService.removeMemoTag(prevMemo.id, t.id);
            } else {
              i++;
              if (!prevTagTexts.includes(tagText)) {
                await memoService.createMemoTag(prevMemo.id, t.id);
              }
            }
          }

          const editedMemo = await memoService.updateMemo(prevMemo.id, content);
          editedMemo.tags = tags;
          editedMemo.updatedAt = utils.getDateTimeString(Date.now());
          memoService.editMemo(editedMemo);
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
    } catch (error: any) {
      toastHelper.error(error.message);
    }

    setEditorContentCache("");
  }, []);

  const handleCancelBtnClick = useCallback(() => {
    globalStateService.setEditMemoId("");
    editorRef.current?.setContent("");
    setEditorContentCache("");
  }, []);

  const handleContentChange = useCallback((content: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    if (tempDiv.innerText.trim() === "") {
      content = "";
    }
    setEditorContentCache(content);
  }, []);

  const { editMemoId } = globalState;

  // 编辑器配置
  const editorConfig = useMemo(
    () => ({
      className: "memo-editor",
      initialContent: getEditorContentCache(),
      placeholder: "现在的想法是...",
      showConfirmBtn: true,
      showCancelBtn: editMemoId === "" ? false : true,
      showTools: true,
      onConfirmBtnClick: handleSaveBtnClick,
      onCancelBtnClick: handleCancelBtnClick,
      onContentChange: handleContentChange,
    }),
    [editMemoId]
  );

  return (
    <div className={"memo-editor-wrapper " + (editMemoId ? "edit-ing" : "")}>
      <p className={"tip-text " + (editMemoId ? "" : "hidden")}>正在修改中...</p>
      <Editor ref={editorRef} {...editorConfig} />
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

export default MemoEditor;
