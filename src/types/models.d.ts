declare namespace Model {
  interface BaseModel {
    id: string;
    createdAt: string;
    updatedAt: string;
  }

  interface User extends BaseModel {
    username: string;
    githubName?: string;
  }

  interface Memo extends BaseModel {
    content: string;
    tags: Tag[];
    deletedAt?: string;
  }

  interface Tag extends BaseModel {
    text: string;
    level: number;
  }
}
