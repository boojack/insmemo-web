import React from "react";
import ReactDOM from "react-dom";
import "../less/toast.less";

type ToastItemProps = {
  type: "normal" | "info" | "error";
  content: string;
};

function Toast(props: ToastItemProps) {
  return (
    <>
      <p className="content-text">{props.content}</p>
    </>
  );
}

export namespace toast {
  let toastContainerDiv: Element | null = null;

  function show(props: ToastItemProps, duration: number) {
    if (!toastContainerDiv) {
      toastContainerDiv = document.querySelector("body > #root > .toast-list-container") as Element;
    }

    const div = document.createElement("div");
    div.className = "toast-container " + props.type;
    toastContainerDiv.appendChild(div);

    const cbs = {
      destory: () => {
        ReactDOM.unmountComponentAtNode(div);
        div.remove();
      },
    };

    if (duration > 0) {
      setTimeout(cbs.destory, duration);
    }

    ReactDOM.render(<Toast {...props} />, div);

    return cbs;
  }

  export function info(content: string, duration: number = 3000) {
    return show({ type: "normal", content }, duration);
  }

  export function error(content: string, duration: number = 3000) {
    return show({ type: "error", content }, duration);
  }
}
