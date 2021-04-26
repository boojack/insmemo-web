import React from "react";
import { api } from "../helpers/api";
import { stateManager } from "../helpers/StateManager";
import { memoService } from "../helpers/memoService";
import { userService } from "../helpers/userService";
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

    this.handleInputerPasted = this.handleInputerPasted.bind(this);
    this.handleInputerChanged = this.handleInputerChanged.bind(this);
    this.handleSaveBtnClick = this.handleSaveBtnClick.bind(this);
    this.handleClearUponMemoClick = this.handleClearUponMemoClick.bind(this);
  }

  public componentDidMount() {
    // note: contenteditable div 换行时会自动生成 div，这里换成 p
    document.execCommand("defaultParagraphSeparator", false, "p");

    stateManager.bindStateChange("uponMemoId", this, async (uponMemoId: string) => {
      let uponMemoContent = "";
      if (uponMemoId) {
        const { data: memo } = await api.getMemoById(uponMemoId);
        uponMemoContent = filterMemoContent(memo.content);
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
        <div className="editor-inputer" contentEditable ref={this.editorRef} onPaste={this.handleInputerPasted} onInput={this.handleInputerChanged}></div>
        <p className={content === "" ? "editor-placeholder" : "hidden"}>记录你的想法...</p>
        <div className="tools-wrapper">
          <div className="tools-container">
            <span className={uponMemoId ? "clear-upon-btn" : "hidden"} onClick={this.handleClearUponMemoClick}>
              ✖️
            </span>
            <p className={uponMemoId ? "upon-memo-content" : "hidden"} dangerouslySetInnerHTML={{ __html: uponMemoContent }}></p>
          </div>
          <button className={"save-btn " + (content === "" ? "disabled" : "")} onClick={this.handleSaveBtnClick}>
            记下✍️
          </button>
        </div>
      </div>
    );
  }

  protected handleInputerPasted(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const content = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, content);
  }

  protected handleInputerChanged(e: React.FormEvent<HTMLDivElement>) {
    const content = e.currentTarget.innerHTML;
    this.setState({
      content,
    });
  }

  protected async handleSaveBtnClick() {
    const uponMemoId = this.state.uponMemoId;
    const content = this.state.content.replaceAll("&nbsp;", " ");

    if (content === "") {
      toast.error("内容不能为空呀");
      return;
    }

    const tagReg = /#(\w+) /g;
    const tagsId = [];
    let tags = content.match(tagReg);

    if (tags && tags.length > 0) {
      tags = utils.dedupe(tags);

      // 保存标签
      for (const t of tags) {
        const { data: tag } = await api.createTag(t.replace("#", "").trim());
        tagsId.push(tag.id);
      }
    }

    let memo: Model.Memo | undefined = undefined;

    // 保存 Memo
    if (userService.checkIsSignIn()) {
      const { data } = await api.createMemo(content, uponMemoId);
      memo = data;
    }

    if (!memo) {
      const nowTime = utils.getNowTimeStamp();

      memo = {
        id: "$local_" + nowTime,
        content,
        uponMemoId,
        createdAt: nowTime,
        updatedAt: nowTime,
      };
    } else {
      // 保存 Memo_Tag
      for (const tagId of tagsId) {
        await api.createMemoTag(memo.id, tagId);
      }
    }

    memoService.push(memo);
    this.setState({
      content: "",
      uponMemoId: "",
    });

    this.editorRef.current!.innerHTML = "";
  }

  protected handleClearUponMemoClick() {
    stateManager.setState("uponMemoId", "");
  }
}

function filterMemoContent(content: string): string {
  return content.replaceAll("\n", "<br>");
}
