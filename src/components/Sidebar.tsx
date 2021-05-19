import React from "react";
import { userService } from "../helpers/userService";
import { UserBanner } from "./UserBanner";
import { showSigninDialog } from "./SigninDialog";
import "../less/siderbar.less";

interface State {
  userinfo: Model.User | null;
}

export class Sidebar extends React.Component {
  public state: State;

  constructor(props: any) {
    super(props);

    this.state = {
      userinfo: null,
    };

    const user = userService.getUserInfo();
    this.state.userinfo = user;
  }

  public componentDidMount() {
    userService.bindStateChange(this, (user) => {
      this.setState({
        userinfo: user,
      });
    });
  }

  public componentWillUnmount() {
    userService.unbindStateListener(this);
  }

  public render() {
    const { userinfo } = this.state;

    return (
      <div className="sidebar-wrapper">
        {userinfo ? (
          <>
            <UserBanner userinfo={userinfo} />
          </>
        ) : (
          <div className="slogan-container">
            <p className="logo-text">insmemo</p>
            {/* <p className="slogan-text">📑 随时随手记一记</p>
            <p className="slogan-text">😋 更好的交互逻辑</p>
            <p className="slogan-text">
              💬 来吧~
              <button className="text-btn action-btn" onClick={this.handleShowSigninDialog}>
                注册/登录
              </button>
            </p> */}
          </div>
        )}
      </div>
    );
  }

  protected handleShowSigninDialog = () => {
    showSigninDialog();
  };
}
