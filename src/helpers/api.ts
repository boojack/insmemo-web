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
    const response = await fetch(url, {
      method: "GET",
    });
    const resData = (await response.json()) as ResponseType<T>;

    if (!resData.succeed) {
      throw resData;
    }

    return resData;
  }

  export async function post<T>(url: string, data?: BasicType): Promise<ResponseType<T>> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = (await response.json()) as ResponseType<T>;

    if (!resData.succeed) {
      throw resData;
    }

    return resData;
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

  export function checkUsernameUsable(username: string) {
    return get<boolean>("/api/user/checkusername?username=" + username);
  }

  export function checkPasswordValid(password: string) {
    return post<boolean>("/api/user/checkpassword", { password });
  }

  export function updateUserinfo(username = "", password = "") {
    return post("/api/user/update", {
      username,
      password,
    });
  }

  export function getMyMemos(offset = 0, amount = 20) {
    return get<Model.Memo[]>(`/api/memo/all?offset=${offset}&amount=${amount}`);
  }

  export function getMyDeletedMemos() {
    return get<Model.Memo[]>(`/api/memo/trash`);
  }

  export function createMemo(content: string) {
    return post<Model.Memo>("/api/memo/new", { content });
  }

  export function getMemoById(id: string) {
    return get<Model.Memo>("/api/memo/?id=" + id);
  }

  export function hideMemo(memoId: string) {
    return post("/api/memo/hide", {
      memoId,
    });
  }

  export function restoreMemo(memoId: string) {
    return post("/api/memo/restore", {
      memoId,
    });
  }

  export function deleteMemo(memoId: string) {
    return post("/api/memo/delete", {
      memoId,
    });
  }

  export function updateMemo(memoId: string, content: string) {
    return post<Model.Memo>("/api/memo/update", { memoId, content });
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

  export function removeMemoTag(memoId: string, tagId: string) {
    return post("/api/tag/rmlink", {
      memoId,
      tagId,
    });
  }

  export function getTagsByMemoId(memoId: string) {
    return get<Model.Tag[]>("/api/tag/memo?id=" + memoId);
  }

  export function getMyTags() {
    return get<Api.Tag[]>("/api/tag/all");
  }

  export function deleteTagById(tagId: string) {
    return post("/api/tag/delete", { tagId });
  }

  export function polishTag(tagId: string) {
    return post("/api/tag/polish", { tagId });
  }

  export function updateTagText(id: string, text: string) {
    return post("/api/tag/update", { id, text });
  }

  export function getMyDataAmount() {
    return get<Api.DataAmounts>("/api/user/amount");
  }

  export function getUrlContentType(url: string) {
    return get<string>("/api/base/srctype?url=" + url);
  }

  export function getMemosStat() {
    return get<Api.MemosStat[]>("/api/memo/stat");
  }

  export function removeGithubName() {
    return post("/api/user/updategh", { githubName: "" });
  }
}
