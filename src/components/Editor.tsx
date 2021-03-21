import React, { FormEvent } from "react";
import StateManager from "../helpers/StateManager";
import "../less/editor.less";

export class Editor extends React.Component {
  public state: {
    content: string;
  };
  public editorRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);

    this.state = {
      content: "",
    };

    this.editorRef = React.createRef();

    this.handleContentInput = this.handleContentInput.bind(this);
    this.handleSendBtnClick = this.handleSendBtnClick.bind(this);
  }

  public render() {
    return (
      <div className="editor-wrapper">
        <div
          ref={this.editorRef}
          className="editor-inputer"
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={this.handleContentInput}
        ></div>
        <p className={this.state.content === "" ? "editor-placeholder" : "hidden"}>请输入</p>
        <div className="tools-wrapper">
          <div className="tools-container">
            <span>B</span>
            <span>I</span>
          </div>
          <button className="save-btn" onClick={this.handleSendBtnClick}>
            Send
          </button>
        </div>
      </div>
    );
  }

  protected handleContentInput(e: FormEvent) {
    const etext = e.currentTarget.textContent;

    this.setState({
      content: etext,
    });
  }

  protected handleSendBtnClick() {
    this.setState({
      content: "",
    });
    this.editorRef.current!.textContent = "";

    const memos = StateManager.getState("memos") as MemoType[];
    memos.unshift({
      id: new Date().toLocaleTimeString(),
      content: this.state.content,
      createdAt: Date.now(),
    });

    StateManager.setState("memos", memos);
  }
}
