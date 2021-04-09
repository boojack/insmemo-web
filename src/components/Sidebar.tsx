import React from "react";
import { userService } from "../helpers/userService";
import { api } from "../helpers/api";
import { UserBanner } from "./UserBanner";
import { SigninDialog } from "./SigninDialog";
import "../less/siderbar.less";

interface State {
  showSigninDialog: boolean;
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
      showSigninDialog: false,
      userinfo: null,
    };

    const user = userService.getUserInfo();
    this.state.userinfo = user;

    this.handleSignoutBtnClick = this.handleSignoutBtnClick.bind(this);
    this.handleShowSigninDialog = this.handleShowSigninDialog.bind(this);
    this.handleSigninDialogClose = this.handleSigninDialogClose.bind(this);
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
    const { showSigninDialog, userinfo } = this.state;

    return (
      <div className="sidebar-wrapper">
        {userinfo ? <UserBanner userinfo={userinfo} /> : null}
        {userinfo ? (
          <div className="menu-container">
            {/* <p className="action-btn" onClick={this.handleSignoutBtnClick}>
              Settings
            </p> */}
            <button className="text-btn action-btn" onClick={this.handleSignoutBtnClick}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="features-container">
            <p className="logo-text">Insmemo</p>
            <p className="slogan-text">- Mainly supports local storage of data;</p>
            <p className="slogan-text">
              - If there is a need for cloud synchronization, you can try to{" "}
              <button className="text-btn action-btn" onClick={this.handleShowSigninDialog}>
                sign up/in
              </button>{" "}
              to an account;
            </p>
          </div>
        )}

        {showSigninDialog ? <SigninDialog close={this.handleSigninDialogClose} /> : null}
      </div>
    );
  }

  protected async handleSignoutBtnClick() {
    await api.signout();
    userService.doSignOut();
  }

  protected handleShowSigninDialog() {
    this.setState({
      showSigninDialog: true,
    });
  }

  protected handleSigninDialogClose() {
    this.setState({
      showSigninDialog: false,
    });
  }
}
