import { utils } from "../helpers/utils";
import appStore from "../stores";

const updateLocationUrl = (method: "replace" | "push" = "replace") => {
  const { query, pathname, hash } = appStore.getState().locationState;
  let queryString = utils.iterObjectToParamsString(query);
  if (queryString) {
    queryString = "?" + queryString;
  } else {
    queryString = "";
  }

  if (method === "replace") {
    window.history.replaceState(null, "", pathname + hash + queryString);
  } else {
    window.history.pushState(null, "", pathname + hash + queryString);
  }
};

class LocationService {
  constructor() {
    this.updateStateWithLocation();
    window.onpopstate = () => {
      this.updateStateWithLocation();
    };
  }

  public updateStateWithLocation = () => {
    const { pathname, search, hash } = window.location;
    const urlParams = new URLSearchParams(search);
    const state: AppLocation = {
      pathname: "/",
      hash: "",
      query: {
        tag: "",
        from: 0,
        to: 0,
        text: "",
        type: "",
      },
    };
    state.query = {
      tag: urlParams.get("tag") ?? "",
      from: parseInt(urlParams.get("from") ?? "0"),
      to: parseInt(urlParams.get("to") ?? "0"),
      type: (urlParams.get("type") ?? "") as MemoType,
      text: urlParams.get("text") ?? "",
    };
    state.hash = hash;
    state.pathname = this.getValidPathname(pathname);
    appStore.dispatch({
      type: "SET_LOCATION",
      payload: state,
    });
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

  public setPathname = (pathname: string) => {
    appStore.dispatch({
      type: "SET_PATHNAME",
      payload: {
        pathname,
      },
    });

    updateLocationUrl();
  };

  public pushHistory = (pathname: string) => {
    appStore.dispatch({
      type: "SET_PATHNAME",
      payload: {
        pathname,
      },
    });

    updateLocationUrl("push");
  };

  public replaceHistory = (pathname: string) => {
    appStore.dispatch({
      type: "SET_PATHNAME",
      payload: {
        pathname,
      },
    });

    updateLocationUrl("replace");
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

  public getValidPathname = (pathname: string): AppRouter => {
    if (["/", "/signin", "/trash"].includes(pathname)) {
      return pathname as AppRouter;
    } else {
      return "/";
    }
  };
}

const locationService = new LocationService();

export default locationService;
