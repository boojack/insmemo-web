/**
 * 实现一个简易版的 markdown 解析
 * - 列表解析；
 * - 代码块；
 * - 加粗；
 */
const CODE_BLOCK_REG = /```([\s\S]*?)```/g;
const BOLD_TEXT_REG = /\*\*(.+?)\*\*/g;
const DOT_LI_REG = /[*] /g;
const NUM_LI_REG = /(\d+)\. /g;

const parseMarkedToHtml = (markedStr: string): string => {
  const htmlText = markedStr
    .replace(CODE_BLOCK_REG, "<pre lang=''>$1</pre>")
    .replace(BOLD_TEXT_REG, "<b>$1</b>")
    .replace(DOT_LI_REG, "<span class='counter-text'>•</span>")
    .replace(NUM_LI_REG, "<span class='counter-text'>$1.</span>");

  return htmlText;
};

const parseHtmlToRawText = (htmlStr: string): string => {
  const tempEl = document.createElement("div");
  tempEl.className = "memo-content-text";
  tempEl.innerHTML = htmlStr;
  document.body.appendChild(tempEl);
  const text = tempEl.innerText;
  tempEl.remove();
  return text;
};

const parseRawTextToHtml = (rawTextStr: string): string => {
  const htmlText = rawTextStr.replace(/\n/g, "<br>");
  return htmlText;
};

export { parseMarkedToHtml, parseHtmlToRawText, parseRawTextToHtml };
