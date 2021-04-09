import { api } from "./api";
import storage from "./storage";

/**
 * State Manager()
 */
class StateManager {
  private data: Map<string, BasicType>;
  private listener: Map<string, { context: Object; handler: FunctionType }[]>;

  constructor() {
    this.data = new Map();
    this.listener = new Map();
  }

  /**
   * init data
   */
  public init() {
    this.setState<Model.User>("user", undefined);
    this.setState<Model.Memo[]>("memos", []);

    this.trySignin();
  }

  public async trySignin() {
    const { data: user } = await api.getUserInfo();
    let localMemos = storage.get(["memo"]).memo as Model.Memo[];

    if (user) {
      this.setState("user", user);

      const { data: memos } = await api.getMyMemos();
      if (memos instanceof Array && memos.length > 0) {
        localMemos.push(...memos);
      }
      const keySet = new Set<string>();
      localMemos.filter((item) => !keySet.has(item.id) && keySet.add(item.id)).sort((a, b) => a.createdAt - b.createdAt);
    }

    this.setState("memos", localMemos);
  }

  public getState(key: string): BasicType | undefined {
    return this.data.get(key);
  }

  public setState<T = BasicType>(key: string, value: T | undefined) {
    this.data.set(key, value);
    this.emitValueChangedEvent(key, value);
  }

  public triggerListeners(key: string) {
    const handlers = this.listener.get(key);
    const value = this.getState(key);

    if (handlers) {
      for (const h of handlers) {
        h.handler(value);
      }
    }
  }

  public bindStateChange(key: string, context: Object, handler: FunctionType) {
    if (!this.data.has(key)) {
      this.setState(key, undefined);
    }

    if (this.listener.has(key)) {
      this.listener.get(key)?.push({ context, handler });
    } else {
      this.listener.set(key, [{ context, handler }]);
    }
  }

  public unbindStateListener(key: string, context: Object) {
    const lns = this.listener.get(key);

    if (lns) {
      for (let i = 0; i < lns.length; ++i) {
        if (lns[i].context === context) {
          lns.splice(i, 1);
          break;
        }
      }
    } else {
      throw new Error("no key in listenr");
    }
  }

  private emitValueChangedEvent(key: string, value: BasicType) {
    const handlers = this.listener.get(key);

    if (handlers) {
      for (const h of handlers) {
        h.handler(value);
      }
    }
  }
}

export default new StateManager();
