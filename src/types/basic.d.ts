type BasicType = undefined | null | boolean | number | string | Object | Array<BasicType>;

// 日期戳
type DateStamp = number;
// 时间戳
type TimeStamp = number;

type FunctionType = (...args: any) => any;

interface IterObject<T = any> {
  [key: string]: T;
}
