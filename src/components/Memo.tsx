import React from "react";

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
        <p>{this.props.memo.content}</p>
      </div>
    );
  }
}
