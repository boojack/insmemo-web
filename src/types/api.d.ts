declare namespace Api {
  interface DataAmounts {
    memosAmount: number;
    tagsAmount: number;
  }

  interface Tag extends Model.Tag {
    amount: number;
  }
}
