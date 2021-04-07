import React from "react";
import "../less/memo.less";

interface Props {
  memo: MemoType;
  index: number;
  deleteHandler: (idx: number) => void;
}

interface MemoItem extends MemoType {
  createdAtStr: string;
}

interface State {
  memo: MemoItem;
}

export class Memo extends React.Component<Props> {
  public state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      memo: {
        ...props.memo,
        content: this.filterMemoContent(props.memo.content),
        createdAtStr: new Date(props.memo.createdAt).toLocaleString(),
      },
    };

    this.deleteMemo = this.deleteMemo.bind(this);
  }

  public render() {
    return (
      <div className="memo-wrapper">
        <div className="memo-top-wrapper">
          <span className="time-text">{this.state.memo.createdAtStr}</span>
          <div className="btns-container">
            <span className="text-btn" onClick={this.uponMemo}>
              Upon
            </span>
            <span className="text-btn" onClick={this.deleteMemo}>
              Delete
            </span>
          </div>
        </div>
        <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: this.state.memo.content }}></div>
      </div>
    );
  }

  protected uponMemo() {
    // todo
  }

  protected deleteMemo() {
    this.props.deleteHandler(this.props.index);
  }

  private filterMemoContent(content: string): string {
    return content.replaceAll("\n", "<br>");
  }
}
