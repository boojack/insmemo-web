import { api } from "../helpers/api";
import { FETCH_MEMO_AMOUNT } from "../helpers/consts";
import appStore from "../stores";
import userService from "./userService";

class MemoService {
  public isFetching: boolean = false;

  public getState() {
    return appStore.getState().memoState;
  }

  public async fetchMoreMemos() {
    if (!userService.getState().user || this.isFetching) {
      return false;
    }

    this.isFetching = true;
    const { data } = await api.getMyMemos(this.getState().memos.length, FETCH_MEMO_AMOUNT);
    const memos: Model.Memo[] = data.map((m) => ({
      ...m,
    }));

    appStore.dispatch({
      type: "PUSH_MEMOS",
      payload: {
        memos,
      },
    });
    this.isFetching = false;

    return memos;
  }

  public async fetchAllMemos() {
    if (!userService.getState().user) {
      return false;
    }

    this.isFetching = true;
    const {
      data: { memosAmount },
    } = await api.getMyDataAmount();
    const { data } = await api.getMyMemos(0, memosAmount);
    const memos = data.map((m) => ({
      ...m,
    }));

    if (memos.length > 0) {
      appStore.dispatch({
        type: "SET_MEMOS",
        payload: {
          memos,
        },
      });
    }
    this.isFetching = false;
    return data;
  }

  public pushMemo(memo: Model.Memo) {
    appStore.dispatch({
      type: "PUSH_MEMO",
      payload: {
        memo: {
          ...memo,
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
    appStore.dispatch({
      type: "DELETE_MEMO_BY_ID",
      payload: {
        id: id,
      },
    });
  }

  public editMemo(memo: Model.Memo) {
    appStore.dispatch({
      type: "EDIT_MEMO",
      payload: memo,
    });
  }

  public clearMemos() {
    appStore.dispatch({
      type: "SET_MEMOS",
      payload: {
        memos: [],
      },
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
    if (!userService.getState().user) {
      return [];
    }

    const { data: tags } = await api.getMyTags();
    return tags;
  }

  public async polishTag(tagId: string) {
    await api.polishTag(tagId);
  }

  public async updateTagText(tagId: string, text: string) {
    await api.updateTagText(tagId, text);
  }
}

const memoService = new MemoService();

export default memoService;
