import { api } from "./api";

type UserInfoStatus = Model.User | null;

class UserService {
  private userinfo: UserInfoStatus;
  private listeners: Map<Object, (user: UserInfoStatus) => void>;

  constructor() {
    this.userinfo = null;
    this.listeners = new Map();

    this.init();
  }

  public async init() {
    await this.doSignIn();
  }

  public getUserInfo() {
    return this.userinfo;
  }

  public async doSignIn() {
    const { data: user } = await api.getUserInfo();

    if (user) {
      this.userinfo = user;
      this.emitValueChangedEvent();
    }
  }

  public doSignOut() {
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
