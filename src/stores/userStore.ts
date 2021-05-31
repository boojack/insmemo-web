import createStore from "./createStore";

interface State {
  user: Model.User | null;
}

interface SignInAction {
  type: "SIGN_IN";
  payload: State;
}

interface SignOutAction {
  type: "SIGN_OUT";
  payload: State;
}

type Action = SignInAction | SignOutAction;

function userReducer(state: State, action: Action): State {
  if (action.type === "SIGN_IN") {
    return {
      user: action.payload.user,
    };
  } else if (action.type === "SIGN_OUT") {
    return {
      user: null,
    };
  } else {
    return state;
  }
}

const userStore = createStore<State, Action>({ user: null }, userReducer);

export default userStore;
