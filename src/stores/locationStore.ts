export type State = AppLocation;

interface SetLocation {
  type: "SET_LOCATION";
  payload: State;
}

interface SetPathnameAction {
  type: "SET_PATHNAME";
  payload: {
    pathname: string;
  };
}

interface SetTagQueryAction {
  type: "SET_TAG_QUERY";
  payload: {
    tag: string;
  };
}

interface SetFromAndToQueryAction {
  type: "SET_FROM_TO_QUERY";
  payload: {
    from: number;
    to: number;
  };
}

interface SetTypeAction {
  type: "SET_TYPE";
  payload: {
    type: MemoType | "";
  };
}

interface SetTextAction {
  type: "SET_TEXT";
  payload: {
    text: string;
  };
}

interface SetHashAction {
  type: "SET_HASH";
  payload: {
    hash: string;
  };
}

export type Actions =
  | SetLocation
  | SetPathnameAction
  | SetTagQueryAction
  | SetFromAndToQueryAction
  | SetTypeAction
  | SetTextAction
  | SetHashAction;

export function reducer(state: State, action: Actions) {
  switch (action.type) {
    case "SET_LOCATION": {
      return action.payload;
    }
    case "SET_PATHNAME": {
      return {
        ...state,
        pathname: action.payload.pathname,
      };
    }
    case "SET_TAG_QUERY": {
      return {
        ...state,
        query: {
          ...state.query,
          tag: action.payload.tag,
        },
      };
    }
    case "SET_FROM_TO_QUERY": {
      return {
        ...state,
        query: {
          ...state.query,
          from: action.payload.from,
          to: action.payload.to,
        },
      };
    }
    case "SET_TYPE": {
      return {
        ...state,
        query: {
          ...state.query,
          type: action.payload.type,
        },
      };
    }
    case "SET_TEXT": {
      return {
        ...state,
        query: {
          ...state.query,
          text: action.payload.text,
        },
      };
    }
    case "SET_HASH": {
      return {
        ...state,
        hash: action.payload.hash,
      };
    }
    default: {
      return state;
    }
  }
}

export const defaultState: State = {
  pathname: "/",
  hash: "",
  query: {
    tag: "",
    from: 0,
    to: 0,
    type: "",
    text: "",
  },
};
