import React from "react";
import ReactDOM from "react-dom";
import "../less/dialog.less";

interface DialogConfig {
  className: string;
  clickSpaceDestroy?: boolean;
}

interface Props extends DialogConfig, DialogProps {}

const BaseDialog: React.FunctionComponent<Props> = (props) => {
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

export function showDialog<T = any>(config: DialogConfig, Fc: React.FunctionComponent<T>, props: any) {
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
    }, 200);
  };

  ReactDOM.render(
    <BaseDialog destroy={destroy} clickSpaceDestroy={true} {...config}>
      <Fc destroy={destroy} {...props}></Fc>
    </BaseDialog>,
    tempDiv
  );
}
