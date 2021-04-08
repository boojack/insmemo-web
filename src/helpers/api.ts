import axios from "axios";

const BASE_URL = "http://localhost:8080";

/**
 * api
 */
export namespace api {
  export async function get(url: string): Promise<any> {
    return axios.get(BASE_URL + url, { withCredentials: true });
  }

  export async function post(url: string, data?: BasicType) {
    return axios.post(BASE_URL + url, data, { withCredentials: true });
  }

  export async function getUserInfo() {
    return await get("/api/user/me");
  }

  export async function signin(username: string, password: string) {
    return await post("/api/user/signin", { username, password });
  }

  export async function signup(username: string, password: string) {
    return await post("/api/user/signup", { username, password });
  }

  export async function signout() {
    return await post("/api/user/signout");
  }
}
