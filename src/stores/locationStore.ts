interface Query {
  tag: string;
  from: number;
  to: number;
}

export interface State {
  hash: string;
  query: Query;
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

interface SetHashAction {
  type: "SET_HASH";
  payload: {
    hash: string;
  };
}

export type Actions = SetTagQueryAction | SetFromAndToQueryAction | SetHashAction;

export function reducer(state: State, action: Actions) {
  switch (action.type) {
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
  hash: "",
  query: {
    tag: "",
    from: 0,
    to: 0,
  },
};
