import React from "react";
import "../less/memo.less";

interface Props {
  memo: MemoType;
}

export class Memo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <div className="memo-wrapper">
        <div className="memo-top-wrapper">
          <span className="time-text">{new Date(this.props.memo.createdAt).toLocaleString()}</span>
        </div>
        <div className="memo-content-text">{this.props.memo.content}</div>
      </div>
    );
  }
}
