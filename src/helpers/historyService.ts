import { utils } from "./utils";

export interface UrlQueryObject {
  tag: string;
}

/**
 * HistoryService
 */
class HistoryService {
  public querys: UrlQueryObject;
  private hash: string;
  private listener: { context: Object; handler: FunctionType }[];

  constructor() {
    this.querys = {
      tag: "",
    };
    this.hash = "";
    this.listener = [];

    this.init();
  }

  public init() {
    const urlParams = new URLSearchParams(window.location.search);
    this.querys["tag"] = urlParams.get("tag") ?? "";
  }

  public setParamsState(querys: Partial<UrlQueryObject>) {
    this.querys = {
      ...this.querys,
      ...querys,
    };

    let nextQueryString = utils.iterObjectToParamsString(this.querys);
    if (Boolean(nextQueryString)) {
      nextQueryString = "?" + nextQueryString;
    } else {
      nextQueryString = "/";
    }
    history.pushState(null, "", nextQueryString);
    this.emitValueChangedEvent();
  }

  public bindStateChange(context: Object, handler: (querys: UrlQueryObject, hash: string) => void) {
    this.listener.push({ context, handler });
  }

  public unbindStateListener(context: Object) {
    for (let i = 0; i < this.listener.length; ++i) {
      if (this.listener[i].context === context) {
        this.listener.splice(i, 1);
        break;
      }
    }
  }

  private emitValueChangedEvent() {
    for (const h of this.listener) {
      h.handler(this.querys, this.hash);
    }
  }
}

export const historyService = new HistoryService();
