import React from "react";
import StateManager from "../helpers/StateManager";
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
  }

  public componentDidMount() {
    StateManager.bindStateChange("memos", this, (memos: MemoType[]) => {
      this.setState({
        memos,
      });
    });
  }

  public render() {
    return (
      <div className="memolist-wrapper">
        {this.state.memos.map((memo) => {
          return <Memo key={memo.id} memo={memo} />;
        })}
      </div>
    );
  }
}
