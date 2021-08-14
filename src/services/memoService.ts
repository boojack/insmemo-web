import { api } from "../helpers/api";
import { FETCH_MEMO_AMOUNT } from "../helpers/consts";
import memoStore from "../stores/memoStore";
import userService from "./userService";

class MemoService {
  public isFetching: boolean = false;

  public getState() {
    return memoStore.getState();
  }

  public async fetchMoreMemos() {
    if (!userService.getState() || this.isFetching) {
      return false;
    }

    let memos: Model.Memo[] = [];
    this.isFetching = true;
    const { data } = await api.getMyMemos(this.getState().memos.length, FETCH_MEMO_AMOUNT);

    if (!Array.isArray(data)) {
      return false;
    }

    memos = data.map((m) => ({
      id: m.id,
      content: m.content,
      tags: m.tags,
      createdAt: new Date(m.createdAt).getTime(),
      updatedAt: new Date(m.updatedAt).getTime(),
    }));

    if (memos.length > 0) {
      memoStore.dispatch({
        type: "PUSH_MEMOS",
        payload: {
          memos,
        },
      });
    }
    this.isFetching = false;

    return memos;
  }

  public async fetchAllMemos() {
    if (!userService.getState() || this.isFetching) {
      return false;
    }

    this.isFetching = true;
    const {
      data: { memosAmount },
    } = await api.getMyDataAmount();
    const { data } = await api.getMyMemos(this.getState().memos.length, memosAmount);
    const memos = data.map((m) => ({
      id: m.id,
      content: m.content,
      tags: m.tags,
      createdAt: new Date(m.createdAt).getTime(),
      updatedAt: new Date(m.updatedAt).getTime(),
    }));

    if (memos.length > 0) {
      memoStore.dispatch({
        type: "PUSH_MEMOS",
        payload: {
          memos,
        },
      });
    }
    this.isFetching = false;
  }

  public pushMemo(memo: Model.Memo) {
    memoStore.dispatch({
      type: "PUSH",
      payload: {
        memo: {
          id: memo.id,
          content: memo.content,
          tags: memo.tags,
          createdAt: new Date(memo.createdAt).getTime(),
          updatedAt: new Date(memo.updatedAt).getTime(),
        },
      },
    });
  }

  public async getMemoById(id: string) {
    for (const m of this.getState().memos) {
      if (m.id === id) {
        return m;
      }
    }

    const { data } = await api.getMemoById(id);
    return data;
  }

  public async deleteMemoById(id: string) {
    await api.deleteMemo(id);
    memoStore.dispatch({
      type: "DELETE_BY_ID",
      payload: {
        id: id,
      },
    });
  }

  public editMemo(memo: Model.Memo) {
    memoStore.dispatch({
      type: "EDIT_MEMO",
      payload: memo,
    });
  }

  public async createMemo(text: string): Promise<Model.Memo> {
    const { data: memo } = await api.createMemo(text);
    return memo;
  }

  public async updateMemo(memoId: string, text: string): Promise<Model.Memo> {
    const { data: memo } = await api.updateMemo(memoId, text);
    return memo;
  }

  public async createTag(text: string): Promise<Model.Tag> {
    const { data: tag } = await api.createTag(text);
    return tag;
  }

  public async removeMemoTag(memoId: string, tagId: string): Promise<void> {
    await api.removeMemoTag(memoId, tagId);
  }

  public async createMemoTag(memoId: string, tagId: string): Promise<void> {
    await api.createMemoTag(memoId, tagId);
  }

  public async getMyDataAmount(): Promise<Api.DataAmounts> {
    const { data } = await api.getMyDataAmount();
    return data;
  }

  public async getMemosStat(): Promise<Api.MemosStat[]> {
    const { data } = await api.getMemosStat();
    return data;
  }

  public async getMyTags(): Promise<Api.Tag[]> {
    const { data: tags } = await api.getMyTags();
    return tags;
  }

  public async polishTag(tagId: string) {
    await api.polishTag(tagId);
  }
}

const memoService = new MemoService();

export default memoService;
