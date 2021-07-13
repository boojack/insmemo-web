import { api } from "./api";
import Toast from "../components/Toast";
import userStore from "../stores/userStore";

const userService = {
  doSignIn: async () => {
    try {
      const user = await getUserInfo();
      if (user) {
        userStore.dispatch({
          type: "SIGN_IN",
          payload: { user },
        });
      }

      return user;
    } catch (error) {
      Toast.error(error);
    }
  },

  doSignOut: async () => {
    await signout();
    userStore.dispatch({
      type: "SIGN_OUT",
      payload: { user: null },
    });
  },

  update: async () => {
    try {
      const user = await getUserInfo();

      if (user) {
        userStore.dispatch({
          type: "SIGN_IN",
          payload: { user },
        });
      } else {
        await signout();
        userStore.dispatch({
          type: "SIGN_OUT",
          payload: { user: null },
        });
      }
    } catch (error) {
      Toast.error(error);
    }
  },

  ...userStore,
};

function getUserInfo(): Promise<Model.User> {
  return new Promise((resolve, reject) => {
    api
      .getUserInfo()
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject("请求失败");
      });
  });
}

function signout(): Promise<void> {
  return new Promise((resolve, reject) => {
    api
      .signout()
      .then(() => {
        resolve();
      })
      .catch(() => {
        // do nth
      });
  });
}

export default userService;
