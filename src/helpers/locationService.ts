import locationStore from "../stores/locationStore";
import { utils } from "./utils";

const updateLocationUrl = () => {
  const prevQueryString = utils.iterObjectToParamsString(locationStore.getState().query);
  const queryString = prevQueryString ? "?" + prevQueryString : "";
  history.replaceState(null, "", "/" + queryString);
};

const locationService = {
  initLocation: () => {
    // 先不处理 hash
    // const hash = window.location.hash;
    // if (hash) {
    //   locationService.setHash(hash);
    // }
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
  setHash: (hash: string) => {
    locationStore.dispatch({
      type: "SET_HASH",
      payload: {
        hash,
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
