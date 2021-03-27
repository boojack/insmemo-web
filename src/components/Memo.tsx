import React from "react";
import "../less/memo.less";

interface Props {
  memo: MemoType;
}

interface State extends Props {}

export class Memo extends React.Component<Props> {
  public state: State;
  constructor(props: Props) {
    super(props);

    this.state = {
      memo: {
        ...props.memo,
      },
    };
    this.state.memo.content = this.state.memo.content.replaceAll("\n", "<br>");
  }

  public render() {
    return (
      <div className="memo-wrapper">
        <div className="memo-top-wrapper">
          <span className="time-text">{new Date(this.state.memo.createdAt).toLocaleString()}</span>
        </div>
        <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: this.state.memo.content }}></div>
      </div>
    );
  }
}
