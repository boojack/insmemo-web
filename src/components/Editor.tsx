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

  constructor(props: any) {
    super(props);

    this.state = {
      content: "",
      uponMemoId: "",
      uponMemoContent: "",
    };

    this.handleInputerChanged = this.handleInputerChanged.bind(this);
    this.handleSaveBtnClick = this.handleSaveBtnClick.bind(this);
    this.handleClearUponMemoClick = this.handleClearUponMemoClick.bind(this);
  }

  public componentDidMount() {
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
        <textarea className="editor-inputer" value={content} onChange={this.handleInputerChanged}></textarea>
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

  protected handleInputerChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      content: e.currentTarget.value,
    });
  }

  protected async handleSaveBtnClick() {
    const uponMemoId = this.state.uponMemoId;
    let content = this.state.content;

    if (content === "") {
      toast.error("内容不能为空呀");
      return;
    }

    const contentRows = content.split("\n");
    const tagsId = [];

    if (contentRows.length > 1) {
      const tagReg = /#\s.*(?!#)/g;
      let tags = contentRows[0].match(tagReg)?.map((t) => t.replace("# ", "").trim());

      // 保存标签
      if (tags) {
        tags = utils.dedupe(tags);

        if (tags.length > 0) {
          contentRows.shift();
          content = contentRows.join("\n");

          for (const t of tags) {
            const { data: tag } = await api.createTag(t);
            tagsId.push(tag.id);
          }
        }
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
  }

  protected handleClearUponMemoClick() {
    stateManager.setState("uponMemoId", "");
  }
}

function filterMemoContent(content: string): string {
  return content.replaceAll("\n", "<br>");
}
