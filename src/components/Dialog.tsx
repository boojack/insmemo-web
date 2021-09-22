import React from "react";
import ReactDOM from "react-dom";
import appContext from "../labs/appContext";
import Provider from "../labs/Provider";
import appStore from "../stores";
import { ANIMATION_DURATION } from "../helpers/consts";
import "../less/dialog.less";

interface DialogConfig {
  className: string;
  clickSpaceDestroy?: boolean;
  useAppContext?: boolean;
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

export function showDialog<T extends DialogProps>(config: DialogConfig, DialogComponent: React.FC<T>, props: Omit<T, "destroy">) {
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

  const dialogProps = {
    ...props,
    destroy,
  } as T;

  let Fragment = (
    <BaseDialog destroy={destroy} clickSpaceDestroy={true} {...config}>
      <DialogComponent {...dialogProps} />
    </BaseDialog>
  );

  if (config.useAppContext) {
    Fragment = (
      <Provider store={appStore} context={appContext}>
        {Fragment}
      </Provider>
    );
  }

  ReactDOM.render(Fragment, tempDiv);
}
