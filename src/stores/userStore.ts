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

type Actions = SignInAction | SignOutAction;

function userReducer(state: State, action: Actions): State {
  switch (action.type) {
    case "SIGN_IN": {
      return {
        user: action.payload.user,
      };
    }
    case "SIGN_OUT": {
      return {
        user: null,
      };
    }
    default: {
      return state;
    }
  }
}

const userStore = createStore<State, Actions>({ user: null }, userReducer);

export default userStore;
