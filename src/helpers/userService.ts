import { showSigninDialog } from "../components/SigninDialog";
import { api } from "./api";

type UserInfoStatus = Model.User | null;

class UserService {
  private userinfo: UserInfoStatus;
  private listeners: Map<Object, (user: UserInfoStatus) => void>;

  constructor() {
    this.userinfo = null;
    this.listeners = new Map();
  }

  public async init() {
    try {
      await this.doSignIn();

      if (!this.checkIsSignIn()) {
        showSigninDialog();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public getUserInfo() {
    return this.userinfo;
  }

  public async doSignIn() {
    const { data: user } = await api.getUserInfo();

    this.userinfo = user;
    this.emitValueChangedEvent();
  }

  public async doSignOut() {
    await api.signout();
    this.userinfo = null;
    this.emitValueChangedEvent();
  }

  public checkIsSignIn(): boolean {
    return this.userinfo !== null;
  }

  public bindStateChange(context: Object, handler: (user: UserInfoStatus) => void) {
    this.listeners.set(context, handler);
  }

  public unbindStateListener(context: Object) {
    this.listeners.delete(context);
  }

  private emitValueChangedEvent() {
    this.listeners.forEach((handler, ctx) => {
      handler.call(ctx, this.userinfo);
    });
  }
}

export const userService = new UserService();
