export interface State {
  markMemoId: string;
  editMemoId: string;
}

interface SetMarkMemoIdAction {
  type: "SET_MARK_MEMO_ID";
  payload: {
    markMemoId: string;
  };
}

interface SetEditMemoIdAction {
  type: "SET_EDIT_MEMO_ID";
  payload: {
    editMemoId: string;
  };
}

export type Actions = SetEditMemoIdAction | SetMarkMemoIdAction;

export function reducer(state: State, action: Actions) {
  switch (action.type) {
    case "SET_MARK_MEMO_ID": {
      return {
        ...state,
        markMemoId: action.payload.markMemoId,
      };
    }
    case "SET_EDIT_MEMO_ID": {
      return {
        ...state,
        editMemoId: action.payload.editMemoId,
      };
    }
    default: {
      return state;
    }
  }
}

export const defaultState: State = {
  markMemoId: "",
  editMemoId: "",
};
