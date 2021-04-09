import React from "react";
import { api } from "../helpers/api";
import { memoService } from "../helpers/memoService";
import { userService } from "../helpers/userService";
import "../less/editor.less";

export class Editor extends React.Component {
  public state: {
    content: string;
  };

  constructor(props: any) {
    super(props);

    this.state = {
      content: "",
    };

    this.handleInputerChanged = this.handleInputerChanged.bind(this);
    this.handleSaveBtnClick = this.handleSaveBtnClick.bind(this);
  }

  public render() {
    return (
      <div className="editor-wrapper">
        <textarea className="editor-inputer" value={this.state.content} onChange={this.handleInputerChanged}></textarea>
        <p className={this.state.content === "" ? "editor-placeholder" : "hidden"}>请输入想法</p>
        <div className="tools-wrapper">
          <div className="tools-container">{/* 
            <span>B</span>
            <span>I</span>
             */}</div>
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
    const content = this.state.content;

    if (content === "") {
      alert("内容不能为空");
      return;
    }

    this.setState({
      content: "",
    });

    if (userService.checkIsSignIn()) {
      // todo
    }

    const { data: memo } = await api.createMemo(content);
    // Create Memo
    memoService.push(memo);
  }
}
