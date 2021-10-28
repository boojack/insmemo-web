type ResponseType<T = unknown> = {
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
async function get<T>(url: string): Promise<ResponseType<T>> {
  const response = await fetch(url, {
    method: "GET",
  });
  const resData = (await response.json()) as ResponseType<T>;

  if (!resData.succeed) {
    throw resData;
  }

  return resData;
}

async function post<T>(url: string, data?: BasicType): Promise<ResponseType<T>> {
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

export function getMyMemos() {
  return get<Model.Memo[]>("/api/memo/all");
}

export function getMyDeletedMemos() {
  return get<Model.Memo[]>("/api/memo/trash");
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

export function getLinkedMemos(memoId: string) {
  return get<Model.Memo[]>("/api/memo/linkeds?memoId=" + memoId);
}

export function getMemosStat() {
  return get<Api.MemosStat[]>("/api/memo/stat");
}

export function removeGithubName() {
  return post("/api/user/updategh", { githubName: "" });
}

export function getMyQueries() {
  return get<Model.Query[]>("/api/query/all");
}

export function createQuery(title: string, querystring: string) {
  return post<Model.Query>("/api/query/new", { title, querystring });
}

export function updateQuery(queryId: string, title: string, querystring: string) {
  return post<Model.Query>("/api/query/update", { queryId, title, querystring });
}

export function deleteQueryById(queryId: string) {
  return post("/api/query/delete", { queryId });
}

export function pinQuery(queryId: string) {
  return post("/api/query/pin", { queryId });
}

export function unpinQuery(queryId: string) {
  return post("/api/query/unpin", { queryId });
}
