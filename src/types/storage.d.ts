/**
 * Define storage data type
 */
interface StorageData {
  shouldSplitMemoWord: boolean;
  shouldMaxMemoHeight: boolean;
}

type StorageKey = keyof StorageData;
