import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../helpers/api";
import memoService from "../helpers/memoService";
import globalStateService from "../helpers/globalStateService";
import locationService from "../helpers/locationService";
import { utils } from "../helpers/utils";
import { storage } from "../helpers/storage";
import toast from "./Toast";
import Editor, { EditorRefActions } from "./Editor/Editor";
import "../less/main-editor.less";

const MainEditor: React.FC = () => {
  const editorRef = React.useRef<EditorRefActions>(null);
  const [editMemoId, setEditMemoId] = useState("");

  useEffect(() => {
    const unsubscribeGlobalState = globalStateService.subscribe((nextState, prevState) => {
      // Mark memo
      if (nextState.markMemoId !== "" && memoService.getMemoById(nextState.markMemoId)) {
        const memoLinkText = `Mark: [@MEMO](${nextState.markMemoId})`;
        editorRef.current?.insertText(`<p>${memoLinkText}</p>`);
      }

      // Edit memo
      if (nextState.editMemoId !== prevState.editMemoId) {
        setEditMemoId(nextState.editMemoId);

        const editMemo = memoService.getMemoById(nextState.editMemoId);
        if (editMemo) {
          editorRef.current?.setContent(editMemo.content ?? "");
          editorRef.current?.focus();
        }
      }
    });

    const unsubscribeLocationService = locationService.subscribe(({ query }) => {
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

      // 标签 正则
      const TAG_REG = /#(.+?)#/g;
      const tagTexts = utils.dedupe(Array.from(content.match(TAG_REG) ?? [])).map((t) => t.replace(TAG_REG, "$1").trim());
      const tags: Model.Tag[] = [];

      // 保存标签
      for (const t of tagTexts) {
        const tag = await createTag(t);
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
              removeMemoTag(prevMemo.id, t.id);
            } else {
              i++;
              if (!prevTagTexts.includes(tagText)) {
                createMemoTag(prevMemo.id, t.id);
              }
            }
          }

          const editedMemo = await updateMemo(prevMemo.id, content);

          prevMemo.tags = tags;
          prevMemo.content = editedMemo.content ?? "";
          prevMemo.updatedAt = Date.now();
          memoService.editMemo(prevMemo);
        }
        globalStateService.setEditMemoId("");
      } else {
        const newMemo = await createMemo(content);

        newMemo.tags = tags;

        // link memo and tag
        for (const t of tags) {
          await createMemoTag(newMemo.id, t.id);
        }
        const tagQuery = locationService.getState().query.tag;
        if (tagQuery !== "" && !tagTexts.includes(tagQuery)) {
          locationService.setTagQuery("");
        }
        memoService.pushMemo(newMemo);
      }

      setEditorContentCache("");
    },
    [editMemoId]
  );

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

function createMemo(text: string): Promise<Model.Memo> {
  return new Promise((resolve, reject) => {
    api
      .createMemo(text)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        // do nth
      });
  });
}

function updateMemo(memoId: string, text: string): Promise<Model.Memo> {
  return new Promise((resolve, reject) => {
    api
      .updateMemo(memoId, text)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        // do nth
      });
  });
}

function createTag(text: string): Promise<Model.Tag> {
  return new Promise((resolve, reject) => {
    api
      .createTag(text)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        // do nth
      });
  });
}

function removeMemoTag(memoId: string, tagId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    api
      .removeMemoTag(memoId, tagId)
      .then(() => {
        resolve();
      })
      .catch(() => {
        // do nth
      });
  });
}

function createMemoTag(memoId: string, tagId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    api
      .createMemoTag(memoId, tagId)
      .then(() => {
        resolve();
      })
      .catch(() => {
        // do nth
      });
  });
}

export default MainEditor;
