import createStore, { Action } from "./createStore";

interface State {
  uponMemoId: string;
  editMemoId: string;
}

interface SetUponMemoIdAction extends Action {
  type: "SET_UPON_MEMO_ID";
  payload: {
    uponMemoId: string;
  };
}

interface SetEditMemoIdAction extends Action {
  type: "SET_EDIT_MEMO_ID";
  payload: {
    editMemoId: string;
  };
}

type Actions = SetEditMemoIdAction | SetUponMemoIdAction;

function globalStateReducer(state: State, action: Actions) {
  switch (action.type) {
    case "SET_UPON_MEMO_ID": {
      return {
        ...state,
        uponMemoId: action.payload.uponMemoId,
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

const globalStateStore = createStore<State, Actions>(
  {
    uponMemoId: "",
    editMemoId: "",
  },
  globalStateReducer
);

export default globalStateStore;
