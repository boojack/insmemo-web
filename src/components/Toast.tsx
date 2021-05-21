import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "../less/toast.less";

const ANIMATION_DURATION = 1600;

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

function Toast(props: ToastItemProps) {
  const { destory, duration } = props;

  useEffect(() => {
    if (duration > 0) {
      setTimeout(destory, duration);
    }
  }, []);

  return (
    <div className="toast-container" onClick={destory}>
      <p className="content-text">{props.content}</p>
    </div>
  );
}

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

    ReactDOM.render(<Toast {...config} destory={cbs.destory} />, div);

    return cbs;
  }

  export function info(content: string, duration: number = 3000) {
    return show({ type: "normal", content, duration });
  }

  export function error(content: string, duration: number = 3000) {
    return show({ type: "error", content, duration });
  }
}
