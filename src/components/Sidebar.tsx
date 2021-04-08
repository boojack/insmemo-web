import React from "react";
import StateManager from "../helpers/StateManager";
import { api } from "../helpers/api";
import { UserBanner } from "./UserBanner";
import { SigninDialog } from "./SigninDialog";
import "../less/siderbar.less";

interface State {
  showSigninDialog: boolean;
  userinfo: UserType | undefined;
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
      userinfo: undefined,
    };

    const user = StateManager.getState("user");

    if (user) {
      this.state.userinfo = user as UserType;
    }

    this.handleSignoutBtnClick = this.handleSignoutBtnClick.bind(this);
    this.handleShowSigninDialog = this.handleShowSigninDialog.bind(this);
    this.handleSigninDialogClose = this.handleSigninDialogClose.bind(this);
  }

  public componentDidMount() {
    StateManager.bindStateChange("user", this, (user: UserType | undefined) => {
      this.setState({
        userinfo: user,
      });
    });
  }

  public render() {
    const { showSigninDialog, userinfo } = this.state;

    return (
      <div className="sidebar-wrapper">
        {userinfo ? <UserBanner userinfo={userinfo} /> : null}
        {userinfo ? (
          <div className="menu-container">
            <p className="action-btn" onClick={this.handleSignoutBtnClick}>
              Sign out
            </p>
          </div>
        ) : (
          <div className="menu-container">
            <p className="action-btn" onClick={this.handleShowSigninDialog}>
              Sign in/up
            </p>
          </div>
        )}

        {showSigninDialog ? <SigninDialog close={this.handleSigninDialogClose} /> : null}
      </div>
    );
  }

  protected async handleSignoutBtnClick() {
    await api.signout();
    StateManager.setState("user", undefined);
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
