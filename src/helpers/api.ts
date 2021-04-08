import axios from "axios";

const BASE_URL = "http://localhost:8080";

/**
 * api
 */
export namespace api {
  export async function get(url: string): Promise<any> {
    const res = await axios.get(BASE_URL + url, { withCredentials: true });
    return res.data;
  }

  export async function post(url: string, data?: BasicType) {
    const res = await axios.post(BASE_URL + url, data, { withCredentials: true });
    return res.data;
  }

  export async function getUserInfo() {
    return get("/api/user/me");
  }

  export async function signin(username: string, password: string) {
    return post("/api/user/signin", { username, password });
  }

  export async function signup(username: string, password: string) {
    return post("/api/user/signup", { username, password });
  }

  export async function signout() {
    return post("/api/user/signout");
  }

  export async function getMyMemos(offset: number = 0) {
    return get(`/api/memo/all?offset=${offset}`);
  }

  export async function createMemo(content: string) {
    return post("/api/memo/new", {
      content,
    });
  }

  export async function deleteMemo(memoId: string) {
    return post("/api/memo/delete", {
      memoId,
    });
  }

  export async function updateMemo(memoId: string, content: string) {
    return post("/api/memo/update", {
      memoId,
      content,
    });
  }
}
