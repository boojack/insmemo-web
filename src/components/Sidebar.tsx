import React from "react";
import { userService } from "../helpers/userService";
import { UserBanner } from "./UserBanner";
import { showSigninDialog } from "./SigninDialog";
import "../less/siderbar.less";

interface State {
  userinfo: Model.User | null;
}

/**
 * 在这里进行 登录态 的管理
 */
export class Sidebar extends React.Component {
  public state: State;

  constructor(props: any) {
    super(props);

    this.state = {
      userinfo: null,
    };

    const user = userService.getUserInfo();
    this.state.userinfo = user;

    this.handleSignoutBtnClick = this.handleSignoutBtnClick.bind(this);
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
            <div className="menu-container">
              {/* <p className="action-btn" onClick={this.handleSignoutBtnClick}>
                Settings
              </p> */}
              <button className="text-btn action-btn" onClick={this.handleSignoutBtnClick}>
                👋 退出
              </button>
            </div>
          </>
        ) : (
          <div className="slogan-container">
            <p className="logo-text">Insmemo</p>
            <p className="slogan-text">💾 主要并且完全支持数据的本地化存储</p>
            <p className="slogan-text">
              💬 当然，如果有数据存储的需求，可以试试
              <button className="text-btn action-btn" onClick={this.handleShowSigninDialog}>
                注册/登录
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  protected async handleSignoutBtnClick() {
    await userService.doSignOut();
  }

  protected handleShowSigninDialog() {
    showSigninDialog();
  }
}
