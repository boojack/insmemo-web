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
    tags: Tag[];
  }

  interface Tag extends BaseModel {
    text: string;
    level: number;
  }
}
