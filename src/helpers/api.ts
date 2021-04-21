import axios from "axios";

const BASE_URL = window.location.host.indexOf(":3000") > -1 ? "http://localhost:8080" : "";
const REQ_CONFIG = window.location.host.indexOf(":3000") > -1 ? { withCredentials: true } : {};

type ResponseType = Partial<{
  status: number;
  message: string;
  data: Object;
}>;

/**
 * api
 */
export namespace api {
  export async function get(url: string): Promise<ResponseType> {
    const res = await axios.get(BASE_URL + url, REQ_CONFIG);
    return res.data as ResponseType;
  }

  export async function post(url: string, data?: BasicType): Promise<ResponseType> {
    const res = await axios.post(BASE_URL + url, data, REQ_CONFIG);
    return res.data as ResponseType;
  }

  export async function getUserInfo(): Promise<Model.User> {
    const { data } = await get("/api/user/me");

    if (data) {
      return data as Model.User;
    }
    return Promise.reject();
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

  export async function createMemo(content: string, uponMemoId?: string) {
    const { data } = await post("/api/memo/new", {
      content,
      uponMemoId,
    });

    if (data) {
      return data as Model.Memo;
    }
    return Promise.reject();
  }

  export async function saveLocalMemo(content: string, createdAt: string, updatedAt: string): Promise<Model.Memo> {
    const { data } = await post("/api/memo/new/local", {
      content,
      createdAt,
      updatedAt,
    });

    if (data) {
      return data as Model.Memo;
    }
    return Promise.reject();
  }

  export async function getMemoById(id: string): Promise<Model.Memo> {
    const { data } = await get("/api/memo/i/" + id);

    if (data) {
      return data as Model.Memo;
    }
    return Promise.reject();
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
