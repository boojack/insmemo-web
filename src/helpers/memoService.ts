import { FETCH_MEMO_AMOUNT } from "./consts";
import { api } from "./api";
import Toast from "../components/Toast";
import memoStore from "../stores/memoStore";
import userService from "./userService";

const memoService = {
  isFetching: false,

  fetchMoreMemos: async () => {
    if (!userService.getState() || memoService.isFetching) {
      return false;
    }

    let memos: Model.Memo[] = [];
    try {
      memoService.isFetching = true;
      const data = await getMyMemos(memoStore.getState().memos.length, FETCH_MEMO_AMOUNT);

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
      memoService.isFetching = false;
    } catch (error) {
      Toast.error(error);
    }

    return memos;
  },

  pushMemo: (memo: Model.Memo) => {
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
  },

  getMemoById: (id: string) => {
    for (const m of memoStore.getState().memos) {
      if (m.id === id) {
        return m;
      }
    }
  },

  deleteMemoById: async (id: string) => {
    await deleteMemo(id);
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

function getMyMemos(offset: number, amount: number): Promise<Model.Memo[]> {
  return new Promise((resolve, reject) => {
    api
      .getMyMemos(offset, amount)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject("请求失败");
      });
  });
}

function deleteMemo(memoId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    api
      .deleteMemo(memoId)
      .then(() => {
        resolve();
      })
      .catch(() => {
        // do nth
      });
  });
}

export default memoService;
