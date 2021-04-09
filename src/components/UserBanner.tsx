import React from "react";
import { memoService } from "../helpers/memoService";
import "../less/user-banner.less";

interface Props {
  userinfo: Model.User;
}

interface State {
  createdDays: number;
  memosAmount: number;
}

export class UserBanner extends React.Component<Props> {
  public state: State;

  constructor(props: Props) {
    super(props);

    const { userinfo } = this.props;

    this.state = {
      createdDays: Math.ceil((Date.now() - new Date(userinfo.createdAt).getTime()) / 1000 / 3600 / 24),
      memosAmount: memoService.getMemos().length,
    };
  }

  public componentDidMount() {
    memoService.bindStateChange(this, (memos) => {
      this.setState({
        memosAmount: memos.length,
      });
    });
  }

  public componentWillUnmount() {
    memoService.unbindStateListener(this);
  }

  public render() {
    const { userinfo } = this.props;

    return (
      <div className="user-banner-wrapper">
        <div className="userinfo-container">
          <p className="username-text">{userinfo.username}</p>
          <div className="status-text-container">
            <p className="status-text memos-text">
              memo: <span className="amount-text">{this.state.memosAmount}</span>
            </p>
            <p className="status-text duration-text">
              day: <span className="amount-text">{this.state.createdDays}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
