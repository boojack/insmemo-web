import React from "react";
import "../less/user-banner.less";

interface Props {
  userinfo: UserType;
}

export class UserBanner extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {}

  public render() {
    const { userinfo } = this.props;

    return (
      <div className="user-banner-wrapper">
        <div className="userinfo-container">
          <p className="username-text">{userinfo.username}</p>
          <div className="status-text-container">
            <p className="memos-text">Memo: 5</p>
            <p className="duration-text">Day: 100</p>
          </div>
        </div>
      </div>
    );
  }
}
