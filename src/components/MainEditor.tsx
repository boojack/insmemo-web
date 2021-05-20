import React from "react";
import { api } from "../helpers/api";
import { stateManager } from "../helpers/stateManager";
import { memoService } from "../helpers/memoService";
import { utils } from "../helpers/utils";
import { toast } from "./Toast";
import { EditorProps, Editor } from "./Editor/Editor";
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
      content: "",
      placeholder: "现在的想法是...",
      showConfirmBtn: true,
      handleConfirmBtnClick: this.handleSaveBtnClick,
      showTools: true,
    };
  }

  public componentDidMount() {
    stateManager.bindStateChange("uponMemoId", this, async (uponMemoId: string) => {
      let uponMemoContent = "";

      if (uponMemoId) {
        const { data: memo } = await api.getMemoById(uponMemoId);
        uponMemoContent = utils.formatMemoContent(memo.content);
        // this.editorRef.current?.focus();
      }

      this.setState({
        uponMemoId,
        uponMemoContent,
      });
    });
  }

  public componentWillUnmount() {
    stateManager.unbindStateListener("uponMemoId", this);
  }

  public render() {
    const { uponMemoId, uponMemoContent } = this.state;

    return (
      <div className="main-editor-wrapper">
        <Editor {...this.editorConfig}></Editor>
        {uponMemoId ? (
          <div className="uponmemo-container" onClick={this.handleClearUponMemoClick}>
            <span className="icon-text">📌</span>
            <div className="uponmemo-content-text" dangerouslySetInnerHTML={{ __html: uponMemoContent }}></div>
          </div>
        ) : null}
      </div>
    );
  }

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
  };

  protected handleClearUponMemoClick = () => {
    stateManager.setState("uponMemoId", "");
  };
}
