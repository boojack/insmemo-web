export namespace utils {
  export function getNowTimeStamp(): number {
    return Date.now();
  }

  export function getOSVersion(): "Windows" | "MacOS" | "Linux" | "Unknown" {
    const appVersion = navigator.appVersion;
    let detectOS: "Windows" | "MacOS" | "Linux" | "Unknown" = "Unknown";

    if (appVersion.indexOf("Win") != -1) {
      detectOS = "Windows";
    } else if (appVersion.indexOf("Mac") != -1) {
      detectOS = "MacOS";
    } else if (appVersion.indexOf("Linux") != -1) {
      detectOS = "Linux";
    }

    return detectOS;
  }

  export function getTimeStampByDate(t: Date | number | string): number {
    const d = new Date(t);

    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  export function getDateString(t: Date | number | string): string {
    const d = new Date(t);

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();

    return `${year}/${month}/${date}`;
  }

  // For example: 2021-4-8 17:52:17
  export function getTimeString(t: Date | number | string): string {
    const d = new Date(t);

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const hours = d.getHours();
    const mins = d.getMinutes();
    const secs = d.getSeconds();

    const monthStr = month < 10 ? "0" + month : month;
    const dateStr = date < 10 ? "0" + date : date;
    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minsStr = mins < 10 ? "0" + mins : mins;
    const secsStr = secs < 10 ? "0" + secs : secs;

    return `${year}-${monthStr}-${dateStr} ${hoursStr}:${minsStr}:${secsStr}`;
  }

  export function getTimeStampString(t: Date | number | string): string {
    const d = new Date(t);

    const hours = d.getHours();
    const mins = d.getMinutes();

    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minsStr = mins < 10 ? "0" + mins : mins;

    return `${hoursStr}:${minsStr}`;
  }

  export function dedupe<T>(data: T[]): T[] {
    return Array.from(new Set(data));
  }

  export function dedupeObjectWithId<T extends { id: string }>(data: T[]): T[] {
    const idSet = new Set<string>();
    const result = [];

    for (const d of data) {
      if (!idSet.has(d.id)) {
        idSet.add(d.id);
        result.push(d);
      }
    }

    return result;
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

  export async function copyTextToClipboard(text: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        console.warn("Copy to clipboard failed.", error);
      }
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      const textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";
      textarea.style.zIndex = "-1";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        return document.execCommand("copy"); // Security exception may be thrown by some browsers.
      } catch (error) {
        console.warn("Copy to clipboard failed.", error);
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    } else {
      console.warn("Copy to clipboard failed, methods not supports.");
    }
  }

  export function parseHTMLToRawString(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    const rawText = div.innerText;

    return rawText;
  }

  export function getImageSize(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const imgEl = new Image();

      imgEl.onload = () => {
        const { width, height } = imgEl;

        if (width > 0 && height > 0) {
          resolve({ width, height });
        } else {
          resolve({ width: 0, height: 0 });
        }
      };

      imgEl.onerror = () => {
        resolve({ width: 0, height: 0 });
      };

      imgEl.className = "hidden";
      imgEl.src = src;
      document.body.appendChild(imgEl);
      imgEl.remove();
    });
  }
}
