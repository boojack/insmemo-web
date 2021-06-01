import { utils } from "./utils";

export interface UrlQueryObject {
  tag: string;
}

/**
 * HistoryService
 */
class HistoryService {
  public query: UrlQueryObject;
  private hash: string;
  private listener: { context: Object; handler: FunctionType }[];

  constructor() {
    this.query = {
      tag: "",
    };
    this.hash = "";
    this.listener = [];

    this.init();
  }

  public init() {
    const urlParams = new URLSearchParams(window.location.search);
    this.query.tag = urlParams.get("tag") ?? "";
  }

  public setParamsState(query: Partial<UrlQueryObject>) {
    this.query = {
      ...this.query,
      ...query,
    };

    let nextQueryString = utils.iterObjectToParamsString(this.query);
    if (Boolean(nextQueryString)) {
      nextQueryString = "?" + nextQueryString;
    } else {
      nextQueryString = "/";
    }
    history.replaceState(null, "", nextQueryString);
    this.emitValueChangedEvent();
  }

  public bindStateChange(context: Object, handler: (query: UrlQueryObject, hash: string) => void) {
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
      h.handler(this.query, this.hash);
    }
  }
}

export const historyService = new HistoryService();
