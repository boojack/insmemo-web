/**
 * State Manager
 * 全局状态管理
 */
class StateManager {
  private data: Map<string, BasicType>;
  private listener: Map<string, { context: Object; handler: FunctionType }[]>;

  constructor() {
    this.data = new Map();
    this.listener = new Map();

    this.init();
  }

  /**
   * init data
   */
  public init() {
    this.setState<string>("uponMemoId", "");
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

export const stateManager = new StateManager();
