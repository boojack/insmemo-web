/**
 * Define storage data type
 */
interface StorageData {
  // 编辑器输入缓存内容
  editorContentCache: string;
  // 分词开关
  shouldSplitMemoWord: boolean;
  // 是否隐藏图片链接地址
  shouldHideImageUrl: boolean;
  // markdown 解析开关
  shouldUseMarkdownParser: boolean;
  // 黑暗模式 开关
  showDarkMode: boolean;
}

type StorageKey = keyof StorageData;
