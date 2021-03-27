import React, { FormEvent } from "react";
import StateManager from "../helpers/StateManager";
import storage from "../helpers/storage";
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
        <p className={this.state.content === "" ? "editor-placeholder" : "hidden"}>请输入</p>
        <div className="tools-wrapper">
          <div className="tools-container">{/* 
            <span>B</span>
            <span>I</span>
             */}</div>
          <button className="save-btn" onClick={this.handleSaveBtnClick}>
            Send
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

  protected handleSaveBtnClick() {
    const content = this.state.content;
    console.log(content);
    this.setState({
      content: "",
    });

    const memos = StateManager.getState("memos") as MemoType[];
    memos.unshift({
      id: new Date().toLocaleTimeString(),
      content: content,
      createdAt: Date.now(),
    });

    storage.set({
      memo: memos,
    });

    StateManager.setState("memos", memos);
  }
}
