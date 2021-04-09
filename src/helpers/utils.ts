export namespace utils {
  export function getNowTimeStamp(): number {
    return Date.now();
  }

  // For example: 2021-4-8 17:52:17
  export function getTimeString(d: Date | number | string): string {
    const date = new Date(d);

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}
