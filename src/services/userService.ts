import { api } from "../helpers/api";
import userStore from "../stores/userStore";

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

class UserService {
  public getState = () => {
    return userStore.getState();
  };

  public doSignIn = async () => {
    try {
      const user = await getUserInfo();
      if (user) {
        userStore.dispatch({
          type: "SIGN_IN",
          payload: { user },
        });
      } else {
        userService.doSignOut();
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  public doSignOut = async () => {
    await signout();
    userStore.dispatch({
      type: "SIGN_OUT",
      payload: { user: null },
    });
  };
}

const userService = new UserService();

export default userService;
