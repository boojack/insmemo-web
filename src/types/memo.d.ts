interface MemoType {
  id: string;
  content: string;
  createdAt: TimeStamp;
  /** 补充 */
  uponMemoId?: string;
}
