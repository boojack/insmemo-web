/**
 * 实现一个简易版的 markdown 解析
 * - 列表解析；
 * - ...
 */
const DOT_LI_REG = /^[\*\-] (.+)$/;
const NUM_LI_REG = /^(\d+)\. (.+)$/;

const marked = (markdownText: string): string => {
  const htmlText = markdownText
    .split("\n")
    .map((t) =>
      t
        .replaceAll(/\*\*(.+?)\*\*/g, "<b>$1</b>")
        .replace(DOT_LI_REG, "<div class='dot-li'><span class='counter-text'>•</span><p>$1</p></div>")
        .replace(NUM_LI_REG, "<div class='num-li'><span class='counter-text'>$1.</span><p>$2</p></div>")
    )
    .join("\n");

  return htmlText;
};

export default marked;
