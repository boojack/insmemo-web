/**
 * Define storage data type
 */
interface StorageData {
  // 编辑器输入缓存
  editorContentCache: string;
  // 分词开关
  shouldSplitMemoWord: boolean;
}

type StorageKey = keyof StorageData;
