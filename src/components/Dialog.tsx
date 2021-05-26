import React from "react";
import ReactDOM from "react-dom";
import "../less/dialog.less";

interface DialogConfig {
  className: string;
}

export interface DialogProps {
  destory: FunctionType;
}

interface Props extends DialogConfig, DialogProps {}

const BaseDialog: React.FunctionComponent<Props> = (props) => {
  const { className, destory } = props;

  return (
    <div className={"dialog-wrapper " + className} onClick={destory}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
};

export function showDialog<T = any>(config: DialogConfig, Fc: React.FunctionComponent<T>, props: any) {
  const tempDiv = document.createElement("div");
  document.body.append(tempDiv);

  const destory = () => {
    ReactDOM.unmountComponentAtNode(tempDiv);
    tempDiv.remove();
  };

  ReactDOM.render(
    <BaseDialog destory={destory} {...config}>
      <Fc destory={destory} {...props}></Fc>
    </BaseDialog>,
    tempDiv
  );
}
