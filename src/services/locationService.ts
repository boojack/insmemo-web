import { utils } from "../helpers/utils";
import appStore from "../stores";

const updateLocationUrl = () => {
  let queryString = utils.iterObjectToParamsString(appStore.getState().locationState.query);
  if (queryString) {
    queryString = "?" + queryString;
  } else {
    queryString = "";
  }
  history.replaceState(null, "", "/" + queryString);
};

class LocationService {
  constructor() {
    this.initLocation();
  }

  public initLocation = () => {
    const urlParams = new URLSearchParams(window.location.search);
    this.setTagQuery(urlParams.get("tag") ?? "");
    this.setFromAndToQuery(parseInt(urlParams.get("from") ?? "0"), parseInt(urlParams.get("to") ?? "0"));
    this.setMemoTypeQuery((urlParams.get("type") ?? "") as MemoType);
    this.setTextQuery(urlParams.get("text") ?? "");
  };

  public getState = () => {
    return appStore.getState().locationState;
  };

  public clearQuery = () => {
    appStore.dispatch({
      type: "SET_TAG_QUERY",
      payload: {
        tag: "",
      },
    });

    appStore.dispatch({
      type: "SET_FROM_TO_QUERY",
      payload: {
        from: 0,
        to: 0,
      },
    });

    updateLocationUrl();
  };

  public setHash = (hash: string) => {
    appStore.dispatch({
      type: "SET_HASH",
      payload: {
        hash,
      },
    });

    updateLocationUrl();
  };

  public setMemoTypeQuery = (type: MemoType | "" = "") => {
    appStore.dispatch({
      type: "SET_TYPE",
      payload: {
        type,
      },
    });

    updateLocationUrl();
  };

  public setTextQuery = (text: string) => {
    appStore.dispatch({
      type: "SET_TEXT",
      payload: {
        text,
      },
    });

    updateLocationUrl();
  };

  public setTagQuery = (tag: string) => {
    appStore.dispatch({
      type: "SET_TAG_QUERY",
      payload: {
        tag,
      },
    });

    updateLocationUrl();
  };

  public setFromAndToQuery = (from: number, to: number) => {
    appStore.dispatch({
      type: "SET_FROM_TO_QUERY",
      payload: {
        from,
        to,
      },
    });

    updateLocationUrl();
  };
}

const locationService = new LocationService();

export default locationService;
