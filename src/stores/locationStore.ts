import createStore, { Action } from "./createStore";

interface Query {
  tag: string;
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

type Actions = SetTagQueryAction;

function locationReducer(state: State, action: Actions) {
  switch (action.type) {
    case "SET_TAG_QUERY": {
      return {
        ...state,
        query: {
          tag: action.payload.tag,
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
    },
  },
  locationReducer
);

export default locationStore;
