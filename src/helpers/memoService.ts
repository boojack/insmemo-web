import { api } from "./api";
import storage from "./storage";
import { userService } from "./userService";
import { utils } from "./utils";

class MemoService {
  private memos: Model.Memo[];
  private listeners: Map<Object, (memos: Model.Memo[]) => void>;

  constructor() {
    const localMemos = storage.get(["memo"]).memo;

    if (localMemos) {
      this.memos = localMemos;
    } else {
      this.memos = [];
    }
    this.listeners = new Map();

    this.init();
  }

  public async init() {
    userService.bindStateChange(this, async (user) => {
      if (user) {
        const { data: memos } = await api.getMyMemos();
        this.memos.push(...(memos as Model.Memo[]));
        this.memos = this.memos.map(
          (m): Model.Memo => {
            return {
              id: m.id,
              content: m.content,
              uponMemoId: m.uponMemoId,
              createdAt: new Date(m.createdAt).getTime(),
              updatedAt: new Date(m.updatedAt).getTime(),
            };
          }
        );

        const keySet = new Set<string>();
        this.memos = this.memos.filter((item) => !keySet.has(item.id) && keySet.add(item.id));
        this.memos.sort((a, b) => b.updatedAt - a.updatedAt);
        this.syncLocalMemos();
        this.emitValueChangedEvent();
      }
    });
  }

  public getMemos() {
    return this.memos;
  }

  public push(memo: Model.Memo) {
    this.memos.unshift(memo);
    this.emitValueChangedEvent();
  }

  public deleteById(id: string) {
    for (let i = 0; i < this.memos.length; ++i) {
      if (this.memos[i].id === id) {
        this.memos.splice(i, 1);
        this.emitValueChangedEvent();
        break;
      }
    }
  }

  public bindStateChange(context: Object, handler: (memos: Model.Memo[]) => void) {
    this.listeners.set(context, handler);
  }

  public unbindStateListener(context: Object) {
    this.listeners.delete(context);
  }

  public async syncLocalMemos() {
    for (const memo of this.memos.filter((m) => m.id.indexOf("local") > 0)) {
      const rawMemo = await api.saveLocalMemo(memo.content, utils.getTimeString(memo.createdAt), utils.getTimeString(memo.updatedAt));
      memo.id = rawMemo.id;
    }

    this.emitValueChangedEvent();
  }

  private emitValueChangedEvent() {
    this.listeners.forEach((handler, ctx) => {
      handler.call(ctx, this.memos);
    });

    storage.set({
      memo: this.memos,
    });
  }
}

export const memoService = new MemoService();
