import globalStateStore from "../stores/globalStateStore";

const globalStateService = {
  setEditMemoId: (editMemoId: string) => {
    globalStateStore.dispatch({
      type: "SET_EDIT_MEMO_ID",
      payload: {
        editMemoId,
      },
    });
  },

  setMarkMemoId: (markMemoId: string) => {
    globalStateStore.dispatch({
      type: "SET_MARK_MEMO_ID",
      payload: {
        markMemoId,
      },
    });
  },

  ...globalStateStore,
};

export default globalStateService;
