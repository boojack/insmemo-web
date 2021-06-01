import locationStore from "../stores/locationStore";
import { utils } from "./utils";

const locationService = {
  setTagQuery: (tag: string) => {
    locationStore.dispatch({
      type: "SET_TAG_QUERY",
      payload: {
        tag,
      },
    });

    let nextQueryString = utils.iterObjectToParamsString(locationStore.getState().query);
    if (Boolean(nextQueryString)) {
      nextQueryString = "?" + nextQueryString;
    } else {
      nextQueryString = "/";
    }
    history.replaceState(null, "", nextQueryString);
  },
  ...locationStore,
};

export default locationService;
