import React, { useEffect, useRef, useState } from "react";
import { utils } from "../helpers/utils";
import { DialogProps, showDialog } from "./Dialog";
import CloseIcon from "../assets/icons/close.svg";
import "../less/preview-image-dialog.less";

interface Props extends DialogProps {
  imgUrl: string;
}

const PreviewImageDialog: React.FunctionComponent<Props> = (props: Props) => {
  const { destory, imgUrl } = props;
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const windowWidth = window.innerWidth;

  useEffect(() => {
    utils.getImageWidth(imgUrl).then((width) => {
      console.log(width);
      const widthRate = (width / windowWidth) * 100;
      setImgWidth(widthRate > 100 ? 100 : widthRate);
    });
  }, []);

  const handleCloseBtnClick = () => {
    destory();
  };

  const handleDecreaseImageSize = () => {
    if (imgWidth > 30) {
      setImgWidth(imgWidth - 10);
    }
  };

  const handleIncreaseImageSize = () => {
    if (imgWidth < 100) {
      setImgWidth(imgWidth + 10);
    }
  };

  return (
    <>
      <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
        <img className="icon-img" src={CloseIcon} />
      </button>

      <div className="img-container">
        <img ref={imgRef} width={imgWidth + "%"} src={imgUrl} />
      </div>

      <div className="action-btns-container">
        <button className="text-btn" onClick={handleDecreaseImageSize}>
          ➖
        </button>
        <button className="text-btn" onClick={handleIncreaseImageSize}>
          ➕
        </button>
        <button className="text-btn" onClick={() => setImgWidth(70)}>
          ⭕
        </button>
      </div>
    </>
  );
};

export function showPreviewImageDialog(imgUrl: string) {
  showDialog(
    {
      className: "preview-image-dialog",
    },
    PreviewImageDialog,
    { imgUrl }
  );
}
