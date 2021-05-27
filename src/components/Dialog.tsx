import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "../less/dialog.less";
const SigninDialog = React.lazy(() => import("./SigninDialog"));
const AboutSiteDialog = React.lazy(() => import("./AboutSiteDialog"));
const PreferencesDialog = React.lazy(() => import("./PreferencesDialog"));
const MemoStoryDialog = React.lazy(() => import("./MemoStoryDialog"));
const GenMemoImageDialog = React.lazy(() => import("./GenMemoImageDialog"));
const PreviewImageDialog = React.lazy(() => import("./PreviewImageDialog"));

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
    <Suspense fallback={<div className="dialog-wrapper"></div>}>
      <BaseDialog destory={destory} {...config}>
        <Fc destory={destory} {...props}></Fc>
      </BaseDialog>
    </Suspense>,
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
