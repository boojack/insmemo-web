import React from "react";
import { memoService } from "../helpers/memoService";
import storage from "../helpers/storage";
import { Memo } from "./Memo";
import "../less/memolist.less";

interface State {
  memos: Model.Memo[];
}

export class MemoList extends React.Component {
  public state: State;

  constructor(props: any) {
    super(props);

    this.state = {
      memos: memoService.getMemos(),
    };

    this.handleDeleteMemoItem = this.handleDeleteMemoItem.bind(this);
  }

  public componentDidMount() {
    memoService.bindStateChange(this, (memos) => {
      this.setState({
        memos,
      });
    });
  }

  public componentWillUnmount() {
    memoService.unbindStateListener(this);
  }

  public render() {
    return (
      <div className="memolist-wrapper">
        {this.state.memos.map((memo, idx) => {
          return <Memo key={memo.id} index={idx} memo={memo} deleteHandler={this.handleDeleteMemoItem} />;
        })}
      </div>
    );
  }

  // Handle memo item delete
  private handleDeleteMemoItem(idx: number) {
    memoService.deleteById(this.state.memos[idx].id);
  }
}
