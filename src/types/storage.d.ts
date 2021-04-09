/**
 * Define storage data type
 */
interface StorageData {
  memo: Model.Memo[];
}

type StorageKey = keyof StorageData;
