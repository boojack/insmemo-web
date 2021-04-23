declare namespace Model {
  interface BaseModel {
    id: string;
    createdAt: TimeStamp;
    updatedAt: TimeStamp;
  }

  interface User extends BaseModel {
    username: string;
  }

  interface Memo extends BaseModel {
    content: string;
    uponMemoId?: string;
  }

  interface Tag extends BaseModel {
    id: string;
    text: string;
  }
}
