import React from "react";
import { api } from "../helpers/api";
import { stateManager } from "../helpers/StateManager";
import { memoService } from "../helpers/memoService";
import { userService } from "../helpers/userService";
import { utils } from "../helpers/utils";
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
        const memo = await api.getMemoById(uponMemoId);
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
        <p className={content ? "editor-placeholder" : "hidden"}>Text in here</p>
        <div className="tools-wrapper">
          <div className="tools-container">
            <span className={uponMemoId ? "clear-upon-btn" : "hidden"} onClick={this.handleClearUponMemoClick}>
              🙅‍♂
            </span>
            <p className={uponMemoId ? "upon-memo-content" : "hidden"} dangerouslySetInnerHTML={{ __html: uponMemoContent }}></p>
          </div>
          <button className="save-btn" onClick={this.handleSaveBtnClick}>
            Mark 🖊
          </button>
        </div>
      </div>
    );
  }

  protected handleInputerChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    // const MAX_SCROLL_HEIGHT = 400;
    // const scrollHeight = e.currentTarget.scrollHeight;
    // console.log(e.currentTarget.scrollHeight, e.currentTarget.clientHeight);

    // if (scrollHeight <= MAX_SCROLL_HEIGHT) {
    //   e.currentTarget.style.height = scrollHeight + "px";
    // } else {
    //   e.currentTarget.style.height = MAX_SCROLL_HEIGHT + "px";
    // }
    this.setState({
      content: e.currentTarget.value,
    });
  }

  protected async handleSaveBtnClick() {
    const { content, uponMemoId } = this.state;

    if (content === "") {
      alert("内容不能为空");
      return;
    }

    this.setState({
      content: "",
      uponMemoId: "",
    });

    let memo: Model.Memo | undefined = undefined;

    if (userService.checkIsSignIn()) {
      memo = await api.createMemo(content, uponMemoId);
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
    }

    memoService.push(memo);
  }

  protected handleClearUponMemoClick() {
    stateManager.setState("uponMemoId", "");
  }
}

function filterMemoContent(content: string): string {
  return content.replaceAll("\n", "<br>");
}
