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
      if (action.payload.pathname === state.pathname) {
        return state;
      }

      return {
        ...state,
        pathname: action.payload.pathname,
      };
    }
    case "SET_TAG_QUERY": {
      if (action.payload.tag === state.query.tag) {
        return state;
      }

      return {
        ...state,
        query: {
          ...state.query,
          tag: action.payload.tag,
        },
      };
    }
    case "SET_FROM_TO_QUERY": {
      if (action.payload.from === state.query.from && action.payload.to === state.query.to) {
        return state;
      }

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
      if (action.payload.type === state.query.type) {
        return state;
      }

      return {
        ...state,
        query: {
          ...state.query,
          type: action.payload.type,
        },
      };
    }
    case "SET_TEXT": {
      if (action.payload.text === state.query.text) {
        return state;
      }

      return {
        ...state,
        query: {
          ...state.query,
          text: action.payload.text,
        },
      };
    }
    case "SET_HASH": {
      if (action.payload.hash === state.hash) {
        return state;
      }

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
