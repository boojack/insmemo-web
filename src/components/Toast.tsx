import React from "react";
import ReactDOM from "react-dom";
import "../less/toast.less";

type ToastItemProps = {
  type: "normal" | "info" | "error";
  content: string;
};

function Toast(props: ToastItemProps) {
  return (
    <div className={"toast-container " + props.type}>
      <p className="content-text">{props.content}</p>
    </div>
  );
}

export namespace toast {
  let toastContainerDiv: Element | null = null;

  function show(props: ToastItemProps, duration: number = 3000) {
    if (!toastContainerDiv) {
      toastContainerDiv = document.querySelector("body > #root > .toast-list-container");
    }
    const div = document.createElement("div");
    toastContainerDiv!.appendChild(div);

    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(div);
      div.remove();
    }, duration);

    ReactDOM.render(<Toast {...props} />, div);
  }

  export function info(content: string, duration: number = 3000) {
    show({ type: "normal", content }, duration);
  }
}
