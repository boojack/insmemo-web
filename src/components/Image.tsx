import React from "react";
import showPreviewImageDialog from "./PreviewImageDialog";
import "../less/image.less";

interface Props {
  className?: string;
  imgUrl: string;
}

const Image: React.FunctionComponent<Props> = (props: Props) => {
  const { className, imgUrl } = props;

  const handleImageClick = () => {
    showPreviewImageDialog(imgUrl);
  };

  return (
    <div className={"image-container " + className} onClick={handleImageClick}>
      <img src={imgUrl} decoding="async" referrerPolicy="no-referrer" loading="lazy" />
    </div>
  );
};

export default Image;
