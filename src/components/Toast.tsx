import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { TOAST_ANIMATION_DURATION } from "../helpers/consts";
import "../less/toast.less";

type ToastType = "normal" | "info" | "error";

type ToastConfig = {
  type: ToastType;
  content: string;
  duration: number;
};

type ToastItemProps = {
  type: ToastType;
  content: string;
  duration: number;
  destory: FunctionType;
};

const Toast: React.FunctionComponent<ToastItemProps> = (props) => {
  const { destory, duration } = props;

  useEffect(() => {
    if (duration > 0) {
      setTimeout(() => {
        destory();
      }, duration);
    }
  }, []);

  return (
    <div className="toast-container" onClick={destory}>
      <p className="content-text">{props.content}</p>
    </div>
  );
};

const toastHelper = (() => {
  const toastContainerDiv: Element = document.createElement("div");
  toastContainerDiv.className = "toast-list-container";
  let shownToastAmount = 0;
  const shownToastContainers: HTMLDivElement[] = [];

  // 非主逻辑下次执行
  setTimeout(() => {
    document.body.appendChild(toastContainerDiv);
  }, 0);

  const showToast = (config: ToastConfig) => {
    const tempDiv = document.createElement("div");
    tempDiv.className = "toast-wrapper " + config.type;
    toastContainerDiv.appendChild(tempDiv);
    shownToastAmount++;
    shownToastContainers.push(tempDiv);

    setTimeout(() => {
      tempDiv.classList.add("showup");
    }, 0);

    const cbs = {
      destory: () => {
        shownToastAmount--;
        tempDiv.classList.add("destory");

        setTimeout(() => {
          if (shownToastAmount === 0) {
            for (const d of shownToastContainers) {
              ReactDOM.unmountComponentAtNode(d);
              d.remove();
            }
          }
        }, TOAST_ANIMATION_DURATION);
      },
    };

    ReactDOM.render(<Toast {...config} destory={cbs.destory} />, tempDiv);

    return cbs;
  };

  const info = (content: string, duration: number = 3000) => {
    return showToast({ type: "normal", content, duration });
  };

  const error = (content: string, duration: number = 3000) => {
    return showToast({ type: "error", content, duration });
  };

  return { info, error };
})();

export default toastHelper;
