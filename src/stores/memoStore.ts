export interface State {
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

interface EditMemoByIdAction {
  type: "EDIT_MEMO";
  payload: Model.Memo;
}

export type Actions = PushMemosAction | PushMemoAction | DeleteMemoByIdAction | EditMemoByIdAction;

export function reducer(state: State, action: Actions): State {
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
      const memos = state.memos.map((m) => {
        if (m.id === action.payload.id) {
          return {
            ...m,
            ...action.payload,
          };
        } else {
          return {
            ...m,
          };
        }
      });

      return {
        memos,
      };
    }
    default: {
      return state;
    }
  }
}

export const defaultState: State = {
  memos: [],
};
