import React from "react";
import { api } from "../helpers/api";
import "../less/memo.less";

interface Props {
  memo: Model.Memo;
  index: number;
  deleteHandler: (idx: number) => void;
}

interface MemoItem extends Model.Memo {
  createdAtStr: string;
}

interface State {
  memo: MemoItem;
  showConfirmDeleteBtn: false;
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
      showConfirmDeleteBtn: false,
    };

    this.deleteMemo = this.deleteMemo.bind(this);
    this.showConfirmDeleteBtn = this.showConfirmDeleteBtn.bind(this);
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
            {this.state.showConfirmDeleteBtn ? (
              <span className="text-btn" onClick={this.deleteMemo}>
                Confirm Delete
              </span>
            ) : (
              <span className="text-btn" onClick={this.showConfirmDeleteBtn}>
                Delete
              </span>
            )}
          </div>
        </div>
        <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: this.state.memo.content }}></div>
      </div>
    );
  }

  protected uponMemo() {
    // todo
  }

  protected async showConfirmDeleteBtn() {
    this.setState({
      showConfirmDeleteBtn: true,
    });

    setTimeout(() => {
      this.setState({
        showConfirmDeleteBtn: false,
      });
    }, 3000);
  }

  protected async deleteMemo() {
    this.props.deleteHandler(this.props.index);

    if (this.state.memo.id.indexOf("local_") < 0) {
      await api.deleteMemo(this.state.memo.id);
    }
  }

  private filterMemoContent(content: string): string {
    return content.replaceAll("\n", "<br>");
  }
}
