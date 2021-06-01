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

  setUponMemoId: (uponMemoId: string) => {
    globalStateStore.dispatch({
      type: "SET_UPON_MEMO_ID",
      payload: {
        uponMemoId,
      },
    });
  },

  ...globalStateStore,
};

export default globalStateService;
