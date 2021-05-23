export namespace utils {
  export function getNowTimeStamp(): number {
    return Date.now();
  }

  // For example: 2021-4-8 17:52:17
  export function getTimeString(d: Date | number | string): string {
    const time = new Date(d);

    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hours = time.getHours();
    const mins = time.getMinutes();
    const secs = time.getSeconds();

    const monthStr = month < 10 ? "0" + month : month;
    const dateStr = date < 10 ? "0" + date : date;
    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minsStr = mins < 10 ? "0" + mins : mins;
    const secsStr = secs < 10 ? "0" + secs : secs;

    return `${year}-${monthStr}-${dateStr} ${hoursStr}:${minsStr}:${secsStr}`;
  }

  export function dedupe<T>(data: T[]): T[] {
    return Array.from(new Set(data));
  }

  // 防抖
  export function debounce(fn: FunctionType, delay: number) {
    let timer: number | null = null;

    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      } else {
        timer = setTimeout(fn, delay);
      }
    };
  }

  // 节流
  export function throttle(fn: FunctionType, delay: number) {
    let valid = true;

    return () => {
      if (!valid) {
        return false;
      }
      valid = false;
      setTimeout(() => {
        fn();
        valid = true;
      }, delay);
    };
  }

  export function iterObjectToParamsString(object: IterObject): string {
    const params = [];

    const keys = Object.keys(object);
    const vals = Object.values(object);

    for (let i = 0; i < keys.length; ++i) {
      if (vals[i]) {
        params.push(`${keys[i]}=${vals[i]}`);
      }
    }

    return params.join("&");
  }
}
