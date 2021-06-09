import { FETCH_MEMO_AMOUNT } from "./consts";
import { api } from "./api";
import memoStore from "../stores/memoStore";
import userService from "./userService";

const memoService = {
  isFetching: false,

  fetchMoreMemos: async () => {
    if (!userService.getState() || memoService.isFetching) {
      return false;
    }

    memoService.isFetching = true;
    const { data } = await api.getMyMemos(memoStore.getState().memos.length, FETCH_MEMO_AMOUNT);

    if (!Array.isArray(data)) {
      return false;
    }

    const memos: Model.Memo[] = data.map((m) => ({
      id: m.id,
      content: m.content,
      uponMemoId: m.uponMemoId,
      tags: m.tags,
      uponMemo: m.uponMemo,
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
    memoService.isFetching = false;

    return memos;
  },

  pushMemo: (memo: Model.Memo) => {
    memoStore.dispatch({
      type: "PUSH",
      payload: {
        memo: {
          id: memo.id,
          content: memo.content,
          uponMemoId: memo.uponMemoId,
          tags: memo.tags,
          uponMemo: memo.uponMemo,
          createdAt: new Date(memo.createdAt).getTime(),
          updatedAt: new Date(memo.updatedAt).getTime(),
        },
      },
    });
  },

  getMemoById: (id: string) => {
    for (const m of memoStore.getState().memos) {
      if (m.id === id) {
        return m;
      }
    }
  },

  deleteMemoById: async (id: string) => {
    await api.deleteMemo(id);
    memoStore.dispatch({
      type: "DELETE_BY_ID",
      payload: {
        id: id,
      },
    });
  },

  editMemo: (memo: Model.Memo) => {
    memoStore.dispatch({
      type: "EDIT_MEMO",
      payload: memo,
    });
  },

  ...memoStore,
};

export default memoService;
