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

const Toast: React.FC<ToastItemProps> = (props) => {
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
  const toastContainerDiv = document.createElement("div");
  toastContainerDiv.className = "toast-list-container";
  document.body.appendChild(toastContainerDiv);

  let shownToastAmount = 0;
  const shownToastContainers: HTMLDivElement[] = [];

  const showToast = (config: ToastConfig) => {
    const tempDiv = document.createElement("div");
    tempDiv.className = `toast-wrapper ${config.type}`;
    toastContainerDiv.appendChild(tempDiv);
    shownToastAmount++;
    shownToastContainers.push(tempDiv);

    setTimeout(() => {
      tempDiv.classList.add("showup");
    }, 0);

    const cbs = {
      destory: () => {
        tempDiv.classList.add("destory");

        setTimeout(() => {
          if (!tempDiv.parentElement) {
            return;
          }

          shownToastAmount--;
          if (shownToastAmount === 0) {
            for (const d of shownToastContainers) {
              ReactDOM.unmountComponentAtNode(d);
              d.remove();
            }
            shownToastContainers.splice(0, shownToastContainers.length);
          }
        }, TOAST_ANIMATION_DURATION);
      },
    };

    ReactDOM.render(<Toast {...config} destory={cbs.destory} />, tempDiv);

    return cbs;
  };

  const info = (content: string, duration = 3000) => {
    return showToast({ type: "normal", content, duration });
  };

  const error = (content: string, duration = 3000) => {
    return showToast({ type: "error", content, duration });
  };

  return { info, error };
})();

export default toastHelper;
