import React from "react";
import { api } from "../helpers/api";
import { stateManager } from "../helpers/stateManager";
import { memoService } from "../helpers/memoService";
import { historyService } from "../helpers/historyService";
import { utils } from "../helpers/utils";
import { storage } from "../helpers/storage";
import { toast } from "./Toast";
import { preferences } from "./PreferencesDialog";
import { EditorProps, Editor } from "./Editor/Editor";
import { formatMemoContent } from "./Memo";
import "../less/main-editor.less";

export class MainEditor extends React.Component {
  public state: {
    content: string;
    uponMemoId: string;
    uponMemoContent: string;
  };
  public editorConfig: EditorProps;

  constructor(props: any) {
    super(props);

    this.state = {
      content: "",
      uponMemoId: "",
      uponMemoContent: "",
    };

    // 编辑器配置
    this.editorConfig = {
      className: "main-editor",
      content: this.getEditorContentCache(),
      placeholder: "现在的想法是...",
      showConfirmBtn: true,
      handleConfirmBtnClick: this.handleSaveBtnClick,
      showTools: true,
      handleContentChange: this.handleContentChange,
      editorRef: React.createRef(),
    };
  }

  public componentDidMount() {
    stateManager.bindStateChange("uponMemoId", this, async (uponMemoId: string) => {
      if (uponMemoId) {
        const { data: memo } = await api.getMemoById(uponMemoId);
        const uponMemoContent = utils.parseHTMLToRawString(formatMemoContent(memo.content));
        // this.editorConfig.editorRef?.current?.focus();
        this.setState({
          uponMemoId,
          uponMemoContent,
        });
      } else {
        this.setState({
          uponMemoId: "",
        });
      }
    });

    historyService.bindStateChange(this, (querys) => {
      const tagText = querys.tag;

      if (tagText) {
        if (preferences.tagTextClickedAction === "insert") {
          this.editorConfig.editorRef?.current?.insertText(`#${tagText}#`);
        } else {
          utils.copyTextToClipboard(`#${tagText}#`);
        }
      }
    });
  }

  public componentWillUnmount() {
    stateManager.unbindStateListener("uponMemoId", this);
    historyService.unbindStateListener(this);
  }

  public render() {
    const { uponMemoId, uponMemoContent } = this.state;

    return (
      <div className="main-editor-wrapper">
        <Editor {...this.editorConfig} />
        <div className={"uponmemo-container " + (uponMemoId ? "" : "hidden")} onClick={this.handleClearUponMemoClick}>
          <img className="icon-img" src="/icons/close.svg" />
          <div className="uponmemo-content-text" dangerouslySetInnerHTML={{ __html: uponMemoContent }}></div>
        </div>
      </div>
    );
  }

  protected handleContentChange = (content: string) => {
    this.setEditorContentCache(content);
  };

  protected handleSaveBtnClick = async (content: string) => {
    const { uponMemoId } = this.state;

    if (content === "") {
      toast.error("内容不能为空呀");
      return;
    }

    const tagReg = /#(.+?)#/g;
    const tagsId = [];
    let tags = content.match(tagReg);

    if (tags && tags.length > 0) {
      tags = utils.dedupe(tags);

      // 保存标签
      for (const t of tags) {
        const { data: tag } = await api.createTag(t.replaceAll(tagReg, "$1").trim());
        tagsId.push(tag.id);
      }
    }

    const { data: memo } = await api.createMemo(content, uponMemoId);

    // 保存 Memo_Tag
    for (const tagId of tagsId) {
      await api.createMemoTag(memo.id, tagId);
    }

    memoService.push(memo);
    this.setState({
      content: "",
      uponMemoId: "",
    });
    this.setEditorContentCache("");
  };

  protected handleClearUponMemoClick = () => {
    stateManager.setState("uponMemoId", "");
  };

  private getEditorContentCache = (): string => {
    return storage.get(["editorContentCache"]).editorContentCache ?? "";
  };

  private setEditorContentCache = (content: string) => {
    storage.set({
      editorContentCache: content,
    });
  };
}
