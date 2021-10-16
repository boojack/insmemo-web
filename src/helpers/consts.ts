// container 选择器
export const PAGE_CONTAINER_SELECTOR = "#page-container";

// 移动端样式适配额外类名
export const MOBILE_ADDITION_CLASSNAME = "mobile-show-sidebar";

// 每次获取 memo 的数量
export const FETCH_MEMO_AMOUNT = 20;

// 默认动画持续时长
export const ANIMATION_DURATION = 200;

// toast 动画持续时长
export const TOAST_ANIMATION_DURATION = 400;

// 一天的毫秒数
export const DAILY_TIMESTAMP = 3600 * 24 * 1000;

// 标签 正则
export const TAG_REG = /#\s(.+?)\s/g;

// URL 正则
export const LINK_REG = /(https?:\/\/[^\s<\\*>']+)/g;

// 图片 正则
export const IMAGE_URL_REG = /(https?:\/\/[^\s<\\*>']+\.(jpeg|jpg|gif|png|svg))/g;

// memo 关联正则
export const MEMO_LINK_REG = /\[@(.+?)\]\((.+?)\)/g;

// memo filter special type
export const MEMO_TYPES = [
  {
    type: "CONNECTED",
    text: "有连接",
  },
  {
    type: "NOT_TAGGED",
    text: "无标签",
  },
  {
    type: "LINKED",
    text: "有超链接",
  },
  {
    type: "IMAGED",
    text: "有图片",
  },
];
