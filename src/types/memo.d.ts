type MemoType = "NOT_TAGGED" | "LINKED" | "IMAGED" | "CONNECTED";

type MemoFilterRalation = "AND" | "OR";

interface BaseFilter {
  type: string;
  value: {
    operator: string;
    value: string;
  };
  relation: MemoFilterRalation;
}

interface MemoTagFilter extends BaseFilter {
  type: "TAG";
  value: {
    operator: "CONTAIN" | "NOT_CONTAIN";
    value: string;
  };
}

interface MemoTypeFilter extends BaseFilter {
  type: "TYPE";
  value: {
    operator: "IS";
    value: MemoType;
  };
}

interface MemoTextFilter extends BaseFilter {
  type: "TEXT";
  value: {
    operator: "CONTAIN" | "NOT_CONTAIN";
    value: string;
  };
}

type FilterType = "TEXT" | "TYPE" | "TAG";

type Filter = BaseFilter | MemoTagFilter | MemoTypeFilter | MemoTextFilter;
