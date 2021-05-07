import React from "react";
import { api } from "../helpers/api";
import { stateManager } from "../helpers/stateManager";
import { memoService } from "../helpers/memoService";
import { utils } from "../helpers/utils";
import { toast } from "./Toast";
import "../less/editor.less";

export class Editor extends React.Component {
  public state: {
    content: string;
    uponMemoId: string;
    uponMemoContent: string;
  };
  private editorRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);

    this.state = {
      content: "",
      uponMemoId: "",
      uponMemoContent: "",
    };

    this.editorRef = React.createRef<HTMLDivElement>();
  }

  public componentDidMount() {
    // note: contenteditable div 换行时会自动生成 div，这里换成 p
    document.execCommand("defaultParagraphSeparator", false, "p");

    stateManager.bindStateChange("uponMemoId", this, async (uponMemoId: string) => {
      let uponMemoContent = "";

      if (uponMemoId) {
        const { data: memo } = await api.getMemoById(uponMemoId);
        uponMemoContent = filterMemoContent(memo.content);
        this.editorRef.current?.focus();
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
    const { content, uponMemoId, uponMemoContent } = this.state;

    return (
      <div className="editor-wrapper">
        <div
          className="editor-inputer"
          contentEditable
          ref={this.editorRef}
          onPaste={this.handleInputerPasted}
          onInput={this.handleInputerChanged}
        ></div>
        <p className={content === "" ? "editor-placeholder" : "hidden"}>现在的想法是...</p>
        <div className="tools-wrapper">
          <div className="tools-container">
            {uponMemoId ? (
              <p
                className="upon-memo-content"
                onClick={this.handleClearUponMemoClick}
                dangerouslySetInnerHTML={{ __html: uponMemoContent }}
              ></p>
            ) : null}
          </div>
          <button className={"save-btn " + (content === "" ? "disabled" : "")} onClick={this.handleSaveBtnClick}>
            记下✍️
          </button>
        </div>
      </div>
    );
  }

  protected handleInputerPasted = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const content = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, content);
  };

  protected handleInputerChanged = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;

    this.setState({
      content,
    });
  };

  protected handleSaveBtnClick = async () => {
    const { content, uponMemoId } = this.state;

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

    this.editorRef.current!.innerHTML = "";
  };

  protected handleClearUponMemoClick = () => {
    stateManager.setState("uponMemoId", "");
  };
}

function filterMemoContent(content: string): string {
  return content.replaceAll("\n", "<br>");
}
