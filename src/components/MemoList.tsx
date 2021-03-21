import React from "react";
import { Memo } from "./Memo";

interface State {
  memos: MemoType[];
}

export class MemoList extends React.Component {
  public state: State;
  constructor(props: any) {
    super(props);

    this.state = {
      memos: [{ content: "123123" }],
    };
  }

  public render() {
    return (
      <div className="memolist-wrapper">
        {this.state.memos.map((memo) => {
          return <Memo memo={memo} />;
        })}
      </div>
    );
  }
}
