/**
 * Define storage data type
 */
interface StorageData {
  memo: MemoType[];
  test: string;
}

type StorageKey = keyof StorageData;
