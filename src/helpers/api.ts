import axios from "axios";

const BASE_URL = window.location.origin.indexOf(":3000") > -1 ? window.location.origin.replace(":3000", ":8080") : "";
const REQ_CONFIG = window.location.origin.indexOf(":3000") > -1 ? { withCredentials: true } : {};

type ResponseType<T = any> = {
  succeed: boolean;
  status: number;
  message: string;
  data: T;
};

/**
 * api
 *
 * Q: 如何进行错误处理？
 * A: 在调用的位置，用 trycatch 块
 */
export namespace api {
  export async function get<T>(url: string): Promise<ResponseType<T>> {
    const res = await axios.get<ResponseType<T>>(BASE_URL + url, REQ_CONFIG);

    if (res.status !== 200) {
      // handler error
      console.error(res);
    }

    return res.data;
  }

  export async function post<T>(url: string, data?: BasicType): Promise<ResponseType<T>> {
    const res = await axios.post<ResponseType<T>>(BASE_URL + url, data, REQ_CONFIG);

    if (res.status !== 200) {
      // handler error
      console.error(res);
    }

    return res.data;
  }

  export function getUserInfo() {
    return get<Model.User>("/api/user/me");
  }

  export function signin(username: string, password: string) {
    return post("/api/user/signin", { username, password });
  }

  export function signup(username: string, password: string) {
    return post("/api/user/signup", { username, password });
  }

  export function signout() {
    return post("/api/user/signout");
  }

  export function getMyMemos(offset: number = 0, amount: number = 20) {
    return get<Model.Memo[]>(`/api/memo/all?offset=${offset}&amount=${amount}`);
  }

  export function createMemo(content: string, uponMemoId?: string) {
    return post<Model.Memo>("/api/memo/new", {
      content,
      uponMemoId,
    });
  }

  export function getMemoById(id: string) {
    return get<Model.Memo>("/api/memo/?id=" + id);
  }

  export function deleteMemo(memoId: string) {
    return post("/api/memo/delete", {
      memoId,
    });
  }

  export function updateMemo(memoId: string, content: string) {
    return post("/api/memo/update", {
      memoId,
      content,
    });
  }

  export function getMemosCount() {
    return get("/api/memo/count");
  }

  export function createTag(text: string) {
    return post<Model.Tag>("/api/tag/new", {
      text,
    });
  }

  export function createMemoTag(memoId: string, tagId: string) {
    return post("/api/tag/link", {
      memoId,
      tagId,
    });
  }

  export function getTagsByMemoId(memoId: string) {
    return get<Model.Tag[]>("/api/tag/memo?id=" + memoId);
  }

  export function getMyTags() {
    return get<Model.Tag[]>("/api/tag/all");
  }

  export function deleteTagById(tagId: string) {
    return post("/api/tag/delete", { tagId });
  }

  export function polishTag(tagId: string) {
    return post("/api/tag/polish", { tagId });
  }
}
