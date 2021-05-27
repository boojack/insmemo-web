import React from "react";
import ReactDOM from "react-dom";
import SigninDialog from "./SigninDialog";
import AboutSiteDialog from "./AboutSiteDialog";
import PreferencesDialog from "./PreferencesDialog";
import MemoStoryDialog from "./MemoStoryDialog";
import GenMemoImageDialog from "./GenMemoImageDialog";
import PreviewImageDialog from "./PreviewImageDialog";
import "../less/dialog.less";

interface DialogConfig {
  className: string;
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

export function showSigninDialog() {
  showDialog(
    {
      className: "signin-dialog",
    },
    SigninDialog,
    {}
  );
}

export function showAboutSiteDialog() {
  showDialog(
    {
      className: "about-site-dialog",
    },
    AboutSiteDialog,
    {}
  );
}

export function showPreferencesDialog() {
  showDialog(
    {
      className: "preferences-dialog",
    },
    PreferencesDialog,
    {}
  );
}

export function showMemoStoryDialog(memoId: string) {
  showDialog(
    {
      className: "memo-story-dialog",
    },
    MemoStoryDialog,
    { memoId }
  );
}

export function showGenMemoImageDialog(memo: FormatedMemo) {
  showDialog(
    {
      className: "gen-memo-image-dialog",
    },
    GenMemoImageDialog,
    { memo }
  );
}

export function showPreviewImageDialog(imgUrl: string) {
  showDialog(
    {
      className: "preview-image-dialog",
    },
    PreviewImageDialog,
    { imgUrl }
  );
}
