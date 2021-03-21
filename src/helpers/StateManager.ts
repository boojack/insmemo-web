/**
 * State Manager
 */
class StateManager {
  private data: Map<string, BasicType>;
  private listener: Map<string, { context: Object; handler: FunctionType }[]>;

  constructor() {
    this.data = new Map();
    this.listener = new Map();

    this.init();
  }

  private init() {
    this.setState<MemoType[]>("memos", [{ id: "123", content: "123123", createdAt: Date.now() }]);
  }

  public getState(key: string): BasicType | undefined {
    return this.data.get(key);
  }

  public setState<T>(key: string, value: T | BasicType) {
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

  private emitValueChangedEvent(key: string, value: BasicType) {
    const handlers = this.listener.get(key);

    if (handlers) {
      for (const h of handlers) {
        h.handler.call(h.context, value);
      }
    }
  }
}

export default new StateManager();
