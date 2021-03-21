import React, { FormEvent } from "react";
import StateManager from "../helpers/StateManager";
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

    this.handleContentInput = this.handleContentInput.bind(this);
    this.handleSendBtnClick = this.handleSendBtnClick.bind(this);
  }

  public render() {
    return (
      <div className="editor-wrapper">
        <div className="editor-inputer" contentEditable="true" onInput={this.handleContentInput}></div>
        <div className="tools-wrapper">
          <div className="tools-container"></div>
          <button className="save-btn" onClick={this.handleSendBtnClick}>
            Send
          </button>
        </div>
      </div>
    );
  }

  protected handleContentInput(e: FormEvent) {
    const etext = e.currentTarget.textContent;
    if (etext) {
      this.setState({
        content: etext,
      });
    }
  }

  protected handleSendBtnClick() {
    const memos = StateManager.getState("memos") as MemoType[];
    memos.unshift({
      content: this.state.content,
      id: new Date().toLocaleTimeString(),
      createdAt: Date.now(),
    });
    StateManager.setState("memos", memos);
  }
}
