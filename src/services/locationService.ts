import { utils } from "../helpers/utils";
import appStore from "../stores";

const updateLocationUrl = () => {
  const prevQueryString = utils.iterObjectToParamsString(appStore.getState().locationState.query);
  const queryString = prevQueryString ? "?" + prevQueryString : "";
  history.replaceState(null, "", "/" + queryString);
};

class LocationService {
  constructor() {
    this.initLocation();
  }

  public initLocation = () => {
    const urlParams = new URLSearchParams(window.location.search);
    this.setTagQuery(urlParams.get("tag") ?? "");
    this.setFromAndToQuery(parseInt(urlParams.get("from") ?? "") ?? 0, parseInt(urlParams.get("to") ?? "") ?? 0);
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
