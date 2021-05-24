import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { ANIMATION_DURATION } from "../helpers/consts";
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
  containerDiv: HTMLDivElement;
};

export const Toast: React.FunctionComponent<ToastItemProps> = (props) => {
  const { containerDiv, duration } = props;

  useEffect(() => {
    if (duration > 0) {
      setTimeout(destory, duration);
    }
  }, []);

  const destory = () => {
    containerDiv.classList.add("destory");

    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(containerDiv);
      containerDiv.remove();
    }, ANIMATION_DURATION);
  };

  return (
    <div className="toast-container" onClick={destory}>
      <p className="content-text">{props.content}</p>
    </div>
  );
};

export namespace toast {
  let toastContainerDiv: Element | null = null;

  function show(config: ToastConfig) {
    if (!toastContainerDiv) {
      toastContainerDiv = document.querySelector("body > #root > .toast-list-container") as Element;
    }

    const div = document.createElement("div");
    div.className = "toast-wrapper " + config.type;
    toastContainerDiv.appendChild(div);

    const cbs = {
      destory: () => {
        div.classList.add("destory");

        setTimeout(() => {
          ReactDOM.unmountComponentAtNode(div);
          div.remove();
        }, ANIMATION_DURATION);
      },
    };

    ReactDOM.render(<Toast {...config} containerDiv={div} />, div);

    return cbs;
  }

  export function info(content: string, duration: number = 3000) {
    return show({ type: "normal", content, duration });
  }

  export function error(content: string, duration: number = 3000) {
    return show({ type: "error", content, duration });
  }
}
