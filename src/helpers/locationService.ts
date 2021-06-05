import locationStore from "../stores/locationStore";
import { utils } from "./utils";

const updateLocationUrl = () => {
  let nextQueryString = utils.iterObjectToParamsString(locationStore.getState().query);
  if (Boolean(nextQueryString)) {
    nextQueryString = "?" + nextQueryString;
  } else {
    nextQueryString = "/";
  }
  history.replaceState(null, "", nextQueryString);
};

const locationService = {
  initQuery: () => {
    const urlParams = new URLSearchParams(window.location.search);
    locationService.setTagQuery(urlParams.get("tag") ?? "");
    locationService.setFromAndToQuery(parseInt(urlParams.get("from") ?? "") ?? 0, parseInt(urlParams.get("to") ?? "") ?? 0);
  },
  clearQuery: () => {
    locationStore.dispatch({
      type: "SET_TAG_QUERY",
      payload: {
        tag: "",
      },
    });

    locationStore.dispatch({
      type: "SET_FROM_TO_QUERY",
      payload: {
        from: 0,
        to: 0,
      },
    });

    updateLocationUrl();
  },
  setTagQuery: (tag: string) => {
    locationStore.dispatch({
      type: "SET_TAG_QUERY",
      payload: {
        tag,
      },
    });

    updateLocationUrl();
  },
  setFromAndToQuery: (from: number, to: number) => {
    locationStore.dispatch({
      type: "SET_FROM_TO_QUERY",
      payload: {
        from,
        to,
      },
    });

    updateLocationUrl();
  },
  ...locationStore,
};

export default locationService;
