import storage from "./storage";

/**
 * State Manager
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
  public async init() {
    const data = storage.get(["memo"]);

    if (data.memo) {
      this.setState<MemoType[]>("memos", data.memo);
    } else {
      this.setState<MemoType[]>("memos", []);
    }
  }

  public getState(key: string): BasicType | undefined {
    return this.data.get(key);
  }

  public setState<T = BasicType>(key: string, value: T) {
    this.data.set(key, value);
    this.emitValueChangedEvent(key, value);
  }

  public bindStateChange(key: string, context: Object, handler: FunctionType) {
    if (this.data.has(key)) {
      if (this.listener.has(key)) {
        this.listener.get(key)?.push({ context, handler });
      } else {
        this.listener.set(key, [{ context, handler }]);
      }
    } else {
      throw new Error("no key in listenr");
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
