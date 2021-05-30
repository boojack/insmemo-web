import { api } from "./api";
import { FETCH_MEMO_AMOUNT } from "./consts";
import { userService } from "./userService";
import { utils } from "./utils";

class MemoService {
  private memos: Model.Memo[];
  private listeners: Map<Object, (memos: Model.Memo[]) => void>;
  private isFetching: boolean = false;

  constructor() {
    this.memos = [];
    this.listeners = new Map();

    this.init();
  }

  public init() {
    userService.bindStateChange(this, async (user) => {
      if (user) {
        await this.fetchMoreMemos();
      }
    });
  }

  public async fetchMoreMemos() {
    if (!userService.getUserInfo() || this.isFetching) {
      return false;
    }

    this.isFetching = true;
    const { data } = await api.getMyMemos(this.memos.length, FETCH_MEMO_AMOUNT);
    if (!Array.isArray(data)) {
      return false;
    }

    const memos = data
      .map((m) => ({
        id: m.id,
        content: m.content,
        uponMemoId: m.uponMemoId,
        tags: m.tags,
        uponMemo: m.uponMemo,
        createdAt: new Date(m.createdAt).getTime(),
        updatedAt: new Date(m.updatedAt).getTime(),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    if (memos.length > 0) {
      this.memos.push(...memos);
      this.memos = utils.dedupeObjectWithId(this.memos);
      this.emitValueChangedEvent();
    }

    this.isFetching = false;

    return memos;
  }

  public getMemos() {
    return this.memos;
  }

  public async push(memo: Model.Memo) {
    const { data: tags } = await api.getTagsByMemoId(memo.id);
    memo.tags = tags;

    if (memo.uponMemoId) {
      for (const m of this.memos) {
        if (m.id === memo.uponMemoId) {
          memo.uponMemo = m;
          break;
        }
      }
    }

    this.memos.unshift(memo);
    this.emitValueChangedEvent();
  }

  public getMemoById(id: string) {
    for (const m of this.memos) {
      if (m.id === id) {
        return m;
      }
    }
  }

  public async deleteById(id: string) {
    for (let i = 0; i < this.memos.length; ++i) {
      if (this.memos[i].id === id) {
        this.memos.splice(i, 1);
        await api.deleteMemo(id);

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

  public emitValueChangedEvent() {
    this.listeners.forEach((handler, ctx) => {
      handler.call(ctx, this.memos);
    });
  }
}

export const memoService = new MemoService();
