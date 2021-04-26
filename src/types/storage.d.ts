/**
 * Define storage data type
 */
interface StorageData {
  test: string;
}

type StorageKey = keyof StorageData;
