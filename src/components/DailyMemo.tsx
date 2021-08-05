import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import { storage } from "../helpers/storage";
import { parseMarkedToHtml } from "../helpers/marked";
import { utils } from "../helpers/utils";
import "../less/daily-memo.less";

// 标签 正则
const TAG_REG = /#([^\n]+?)#/g;
// URL 正则
const LINK_REG = /(https?:\/\/[^\s<\\*>']+)/g;
// 图片路由正则
const IMAGE_URL_REG = /(https?:\/\/[^\s<\\*>']+\.(jpeg|jpg|gif|png|svg))/g;
// memo 关联正则
const MEMO_LINK_REG = /\[@(.+?)\]\((.+?)\)/g;

interface DailyMemo extends FormattedMemo {
  timeStr: string;
}

interface Props {
  memo: Model.Memo;
  index: number;
}

const DailyMemo: React.FC<Props> = (props: Props) => {
  const { memo: propsMemo } = props;
  const [memo, setMemo] = useState<DailyMemo>({
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
    timeStr: utils.getTimeStampString(propsMemo.createdAt),
  });

  useEffect(() => {
    setMemo({
      ...memo,
      formattedContent: formatMemoContent(memo.content),
    });
  }, []);

  return (
    <div className="daily-memo-wrapper">
      <span className="time-text">{memo.timeStr}</span>
      <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formattedContent }}></div>
      {/* <div className="btns-container">
        <span className="text-btn" onClick={handleGenMemoImageBtnClick}>
          分享
        </span>
        <span className="text-btn" onClick={handleEditMemoClick}>
          编辑
        </span>
        <span className="text-btn delete-btn" onClick={handleDeleteMemoClick}>
          {showConfirmDeleteBtn ? "确定删除！" : "删除"}
        </span>
      </div> */}
    </div>
  );
};

function formatMemoContent(content: string): string {
  const tempDivContainer = document.createElement("div");
  tempDivContainer.innerHTML = content;
  const tempFirstPElement = document.createElement("p");

  while (tempDivContainer.firstChild && tempDivContainer.firstChild.nodeName !== "P") {
    const node = tempDivContainer.firstChild;
    if (node.nodeName === "#text") {
      tempFirstPElement.innerHTML += node.nodeValue;
    } else {
      tempFirstPElement.innerHTML += (node as Element).outerHTML;
    }
    node.remove();
  }

  if (tempFirstPElement.innerHTML !== "") {
    tempDivContainer.prepend(tempFirstPElement);
    content = tempDivContainer.innerHTML;
  }

  const { shouldUseMarkdownParser, shouldSplitMemoWord, shouldHideImageUrl } = storage.preferences;

  if (shouldUseMarkdownParser) {
    content = parseMarkedToHtml(content);
  }

  // 中英文之间加空格，这里只是简单的用正则分开了，可优化
  if (shouldSplitMemoWord) {
    content = content.replace(/([\u4e00-\u9fa5])([A-Za-z0-9?.,;\[\]\(\)]+)([\u4e00-\u9fa5]?)/g, "$1 $2 $3");
  }

  if (shouldHideImageUrl) {
    content = content.replace(IMAGE_URL_REG, "");
  }

  content = content
    .replace(TAG_REG, "<span class='tag-span'>#$1#</span>")
    .replace(LINK_REG, "<a class='link' target='_blank' rel='noreferrer' href='$1'>$1</a>")
    .replace(MEMO_LINK_REG, "<span class='memo-link-text' data-value='$2'>$1</span>");

  return content;
}

export default DailyMemo;
