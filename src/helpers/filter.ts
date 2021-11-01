// memo filter special type
export const MEMO_TYPES = [
  {
    text: "有关联",
    value: "CONNECTED",
  },
  {
    text: "无标签",
    value: "NOT_TAGGED",
  },
  {
    text: "有超链接",
    value: "LINKED",
  },
  {
    text: "有图片",
    value: "IMAGED",
  },
];

export const MEMO_FILTER_TYPES = [
  {
    text: "类型",
    value: "TYPE",
  },
  {
    text: "标签",
    value: "TAG",
  },
  {
    text: "文本",
    value: "TEXT",
  },
];

interface Operator {
  text: string;
  value: string;
}

export const MEMO_FILTER_OPERATORS: IterObject<Operator[]> = {
  TYPE: [
    {
      text: "是",
      value: "IS",
    },
  ],
  TEXT: [
    {
      text: "含有",
      value: "CONTAIN",
    },
    {
      text: "不包括",
      value: "NOT_CONTAIN",
    },
  ],
  TAG: [
    {
      text: "含有",
      value: "CONTAIN",
    },
    {
      text: "不包括",
      value: "NOT_CONTAIN",
    },
  ],
};

export const getTextWithMemoType = (type: string): string => {
  for (const t of MEMO_TYPES) {
    if (t.value === type) {
      return t.text;
    }
  }
  return "";
};

export const getDefaultFilter = (): BaseFilter => {
  return {
    type: "TYPE",
    value: {
      operator: "CONTAIN",
      value: "",
    },
    relation: "AND",
  };
};
