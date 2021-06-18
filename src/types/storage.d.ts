/**
 * Define storage data type
 */
interface StorageData {
  // 编辑器输入缓存内容
  editorContentCache: string;
  // 分词开关
  shouldSplitMemoWord: boolean;
  // 标签点击动作
  tagTextClickedAction: "copy" | "insert";
  // markdown 解析开关
  shouldUseMarkdownParser: boolean;
  // 黑暗模式 开关
  showDarkMode: boolean;
}

type StorageKey = keyof StorageData;
