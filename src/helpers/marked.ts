/**
 * 实现一个简易版的 markdown 解析
 * - 列表解析；
 * - ...
 */
const CODE_BLOCK_REG = /'''([\s\S]*?)'''/g;
const DOT_LI_REG = /[\*\-] /g;
const NUM_LI_REG = /(\d+)\. /g;

const parseMarkedToHtml = (markdownText: string): string => {
  const htmlText = markdownText
    .replace(CODE_BLOCK_REG, "<pre lang=''>$1</pre>")
    .replace(DOT_LI_REG, "<span class='counter-text'>•</span>")
    .replace(NUM_LI_REG, "<span class='counter-text'>$1.</span>");

  return htmlText;
};

export { parseMarkedToHtml };
