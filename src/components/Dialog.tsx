import React from "react";
import ReactDOM from "react-dom";
import "../less/dialog.less";

interface DialogConfig {
  className: string;
  clickSpaceDestory?: boolean;
}

interface Props extends DialogConfig, DialogProps {}

const BaseDialog: React.FunctionComponent<Props> = (props) => {
  const { className, clickSpaceDestory, destory } = props;

  const handleSpaceClicked = () => {
    if (clickSpaceDestory) {
      destory();
    }
  };

  return (
    <div className={"dialog-wrapper " + className} onClick={handleSpaceClicked}>
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
    <BaseDialog destory={destory} clickSpaceDestory={true} {...config}>
      <Fc destory={destory} {...props}></Fc>
    </BaseDialog>,
    tempDiv
  );
}
