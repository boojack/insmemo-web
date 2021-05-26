import React from "react";
import { showPreviewImageDialog } from "./PreviewImageDialog";
import "../less/imagex.less";

interface Props {
  className?: string;
  imgUrl: string;
}

export const ImageX: React.FunctionComponent<Props> = (props: Props) => {
  const { className, imgUrl } = props;

  const handleImageClick = () => {
    showPreviewImageDialog(imgUrl);
  };

  return (
    <div className={"imagex-container " + className} onClick={handleImageClick}>
      <img src={imgUrl} decoding="async" loading="lazy" />
    </div>
  );
};
