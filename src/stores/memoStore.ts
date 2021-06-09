import createStore, { Action } from "./createStore";

interface State {
  memos: Model.Memo[];
}

interface PushMemoAction extends Action {
  type: "PUSH";
  payload: {
    memo: Model.Memo;
  };
}

interface PushMemosAction extends Action {
  type: "PUSH_MEMOS";
  payload: {
    memos: Model.Memo[];
  };
}

interface DeleteMemoByIdAction extends Action {
  type: "DELETE_BY_ID";
  payload: {
    id: string;
  };
}

interface EditMemoByIdAction extends Action {
  type: "EDIT_MEMO";
  payload: Model.Memo;
}

type Actions = PushMemosAction | PushMemoAction | DeleteMemoByIdAction | EditMemoByIdAction;

function memoReducer(state: State, action: Actions): State {
  switch (action.type) {
    case "PUSH": {
      const memo = action.payload.memo;
      const memos = [memo, ...state.memos].sort((a, b) => b.createdAt - a.createdAt);

      return {
        memos,
      };
    }
    case "PUSH_MEMOS": {
      const memos = [...action.payload.memos, ...state.memos].sort((a, b) => b.createdAt - a.createdAt);

      return {
        memos,
      };
    }
    case "DELETE_BY_ID": {
      return {
        memos: [...state.memos].filter((memo) => memo.id !== action.payload.id),
      };
    }
    case "EDIT_MEMO": {
      for (let i = 0; i < state.memos.length; i++) {
        if (state.memos[i].id === action.payload.id) {
          state.memos[i] = Object.assign({}, action.payload);
          break;
        }
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

const memoStore = createStore<State, Actions>({ memos: [] }, memoReducer);

export default memoStore;
