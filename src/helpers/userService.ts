import { api } from "./api";
import userStore from "../stores/userStore";

const userService = {
  doSignIn: async () => {
    const { data: user } = await api.getUserInfo();
    if (user) {
      userStore.dispatch({
        type: "SIGN_IN",
        payload: { user },
      });
    }

    return user
  },

  doSignOut: async () => {
    await api.signout();
    userStore.dispatch({
      type: "SIGN_OUT",
      payload: { user: null },
    });
  },
  ...userStore,
};

export default userService;
