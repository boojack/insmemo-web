/**
 * Define storage data type
 */
interface StorageData {
  // 编辑器输入缓存
  editorContentCache: string;
  // 分词开关
  shouldSplitMemoWord: boolean;
  // 标签点击动作
  tagTextClickedAction: "copy" | "insert";
}

type StorageKey = keyof StorageData;
