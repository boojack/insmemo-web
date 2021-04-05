import React from "react";
import StateManager from "../helpers/StateManager";
import storage from "../helpers/storage";
import { Memo } from "./Memo";
import "../less/memolist.less";

interface State {
  memos: MemoType[];
}

export class MemoList extends React.Component {
  public state: State;

  constructor(props: any) {
    super(props);

    this.state = {
      memos: (StateManager.getState("memos") as MemoType[]).reverse(),
    };

    this.handleDeleteMemoItem = this.handleDeleteMemoItem.bind(this);
  }

  public componentDidMount() {
    StateManager.bindStateChange("memos", this, (memos: MemoType[]) => {
      this.setState({
        memos,
      });
    });
  }

  public componentWillUnmount() {
    // do nth
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
    this.state.memos.splice(idx, 1);
    this.setState({
      memos: this.state.memos,
    });
    StateManager.setState("memos", this.state.memos);
    storage.set({
      memo: this.state.memos,
    });
  }
}
