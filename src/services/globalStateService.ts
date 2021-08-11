import globalStateStore from "../stores/globalStateStore";

class GlobalStateService {
  public getState = () => {
    return globalStateStore.getState();
  };

  public setEditMemoId = (editMemoId: string) => {
    globalStateStore.dispatch({
      type: "SET_EDIT_MEMO_ID",
      payload: {
        editMemoId,
      },
    });
  };

  public setMarkMemoId = (markMemoId: string) => {
    globalStateStore.dispatch({
      type: "SET_MARK_MEMO_ID",
      payload: {
        markMemoId,
      },
    });
  };
}

const globalStateService = new GlobalStateService();

export default globalStateService;
