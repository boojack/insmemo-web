/**
 * Define storage data type
 */
interface StorageData {
  shouldSplitMemoWord: boolean;
}

type StorageKey = keyof StorageData;
