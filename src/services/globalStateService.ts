import appStore from "../stores";

class GlobalStateService {
  public getState = () => {
    return appStore.getState().globalState;
  };

  public setEditMemoId = (editMemoId: string) => {
    appStore.dispatch({
      type: "SET_EDIT_MEMO_ID",
      payload: {
        editMemoId,
      },
    });
  };

  public setMarkMemoId = (markMemoId: string) => {
    appStore.dispatch({
      type: "SET_MARK_MEMO_ID",
      payload: {
        markMemoId,
      },
    });
  };
}

const globalStateService = new GlobalStateService();

export default globalStateService;
