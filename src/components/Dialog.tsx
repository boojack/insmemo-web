import React from "react";
import ReactDOM from "react-dom";
import { ANIMATION_DURATION } from "../helpers/consts";
import "../less/dialog.less";

interface DialogConfig {
  className: string;
  clickSpaceDestroy?: boolean;
}

interface Props extends DialogConfig, DialogProps {}

const BaseDialog: React.FC<Props> = (props) => {
  const { children, className, clickSpaceDestroy, destroy } = props;

  const handleSpaceClicked = () => {
    if (clickSpaceDestroy) {
      destroy();
    }
  };

  return (
    <div className={`dialog-wrapper ${className}`} onClick={handleSpaceClicked}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export function showDialog<T = any>(config: DialogConfig, DialogComponent: React.FC<T>, props: any) {
  const tempDiv = document.createElement("div");
  document.body.append(tempDiv);

  setTimeout(() => {
    tempDiv.firstElementChild?.classList.add("showup");
  }, 0);

  const destroy = () => {
    tempDiv.firstElementChild?.classList.add("showoff");
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(tempDiv);
      tempDiv.remove();
    }, ANIMATION_DURATION);
  };

  ReactDOM.render(
    <BaseDialog destroy={destroy} clickSpaceDestroy={true} {...config}>
      <DialogComponent destroy={destroy} {...props}></DialogComponent>
    </BaseDialog>,
    tempDiv
  );
}
