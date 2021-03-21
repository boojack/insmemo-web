import React from "react";
import "../less/editor.less";

export class Editor extends React.Component {
  public render() {
    return (
      <div className="editor-wrapper">
        <div className="editor-textarea" contentEditable="true"></div>
        <div className="tools-wrapper">
          <div className="tools-container">
            <span>B</span>
            <span>I</span>
          </div>
          <button>Send</button>
        </div>
      </div>
    );
  }
}
