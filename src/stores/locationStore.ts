import createStore, { Action } from "./createStore";

interface Query {
  tag: string;
  from: number;
  to: number;
}

interface State {
  query: Query;
}

interface SetTagQueryAction extends Action {
  type: "SET_TAG_QUERY";
  payload: {
    tag: string;
  };
}

interface SetFromAndToQueryAction extends Action {
  type: "SET_FROM_TO_QUERY";
  payload: {
    from: number;
    to: number;
  };
}

type Actions = SetTagQueryAction | SetFromAndToQueryAction;

function locationReducer(state: State, action: Actions) {
  switch (action.type) {
    case "SET_TAG_QUERY": {
      return {
        query: {
          ...state.query,
          tag: action.payload.tag,
        },
      };
    }
    case "SET_FROM_TO_QUERY": {
      return {
        query: {
          ...state.query,
          from: action.payload.from,
          to: action.payload.to,
        },
      };
    }
    default: {
      return state;
    }
  }
}

const locationStore = createStore<State, Actions>(
  {
    query: {
      tag: "",
      from: 0,
      to: 0,
    },
  },
  locationReducer
);

export default locationStore;
