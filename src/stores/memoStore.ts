import createStore from "./createStore";

interface State {
  memos: Model.Memo[];
}

interface PushMemoAction {
  type: "PUSH";
  payload: {
    memo: Model.Memo;
  };
}

interface PushMemosAction {
  type: "PUSH_MEMOS";
  payload: {
    memos: Model.Memo[];
  };
}

interface DeleteMemoByIdAction {
  type: "DELETE_BY_ID";
  payload: {
    id: string;
  };
}

type Action = PushMemosAction | PushMemoAction | DeleteMemoByIdAction;

function memoReducer(state: State, action: Action): State {
  if (action.type === "PUSH") {
    const memo = action.payload.memo;
    const memos = [memo, ...state.memos].sort((a, b) => b.createdAt - a.createdAt);

    return {
      memos,
    };
  } else if (action.type === "PUSH_MEMOS") {
    const memos = [...action.payload.memos, ...state.memos].sort((a, b) => b.createdAt - a.createdAt);

    return {
      memos,
    };
  } else if (action.type === "DELETE_BY_ID") {
    return {
      memos: [...state.memos].filter((memo) => memo.id !== action.payload.id),
    };
  } else {
    return state;
  }
}

const memoStore = createStore<State, Action>({ memos: [] }, memoReducer);

export default memoStore;
