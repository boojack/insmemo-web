import { storage } from "../helpers/storage";
import appStore from "../stores";
import { AppSetting } from "../stores/globalStateStore";

class GlobalStateService {
  constructor() {
    const cachedSetting = storage.get(["shouldSplitMemoWord", "shouldHideImageUrl", "shouldUseMarkdownParser", "showDarkMode"]);
    const defaultAppSetting = {
      shouldSplitMemoWord: cachedSetting.shouldSplitMemoWord ?? true,
      shouldHideImageUrl: cachedSetting.shouldHideImageUrl ?? true,
      shouldUseMarkdownParser: cachedSetting.shouldUseMarkdownParser ?? true,
      showDarkMode: cachedSetting.showDarkMode ?? false,
    };

    this.setAppSetting(defaultAppSetting);
  }

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

  public setIsMobileView = (isMobileView: boolean) => {
    appStore.dispatch({
      type: "SET_MOBILE_VIEW",
      payload: {
        isMobileView,
      },
    });
  };

  public setAppSetting = (appSetting: Partial<AppSetting>) => {
    appStore.dispatch({
      type: "SET_APP_SETTING",
      payload: appSetting,
    });
    storage.set(appSetting);
  };
}

const globalStateService = new GlobalStateService();

export default globalStateService;
