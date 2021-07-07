import React, { useEffect, useRef, useState } from "react";
import userService from "../helpers/userService";
import { ANIMATION_DURATION } from "../helpers/consts";
import { utils } from "../helpers/utils";
import { storage } from "../helpers/storage";
import { showDialog } from "./Dialog";
import { formatMemoContent } from "./Memo";
import "../less/gen-memo-image-dialog.less";

// 图片路由正则
const IMAGE_URL_REG = /(https?:\/\/[^\s<\\*>']+\.(jpeg|jpg|gif|png|svg))/g;

interface Props extends DialogProps {
  memo: Model.Memo;
}

const GenMemoImageDialog: React.FC<Props> = (props) => {
  const { memo: propsMemo, destroy } = props;
  const [imgUrl, setImgUrl] = useState("");
  const memoElRef = useRef<HTMLDivElement>(null);
  const { user: userinfo } = userService.getState();
  const memo: FormattedMemo = {
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  };
  const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
  const [imageAmount, setImageAmount] = useState(imageUrls.length);

  useEffect(() => {
    const memoEl = memoElRef.current;

    if (memoEl) {
      setTimeout(() => {
        if (imageAmount === 0) {
          const osVersion = utils.getOSVersion();
          let scaleRate = 4;
          if (osVersion === "MacOS" || osVersion === "Unknown") {
            scaleRate = 2;
          }

          html2canvas(memoEl, {
            scale: scaleRate,
            backgroundColor: storage.preferences.showDarkMode ? "#2f3437" : "white",
            useCORS: true,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
          }).then((canvas) => {
            setImgUrl(canvas.toDataURL());
          });
        }
      }, ANIMATION_DURATION + 100);
    }
  }, [imageAmount]);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleImageOnLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    if (ev.type === "error") {
      (ev.target as HTMLImageElement).remove();
    }
    setImageAmount(imageAmount - 1);
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🥰</span>分享 Memo 图片
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <div className={`tip-words-container ${imgUrl ? "finished" : "genarating"}`}>
          <p className="tip-text">{imgUrl ? "右键或长按即可保存图片 👇" : "图片生成中..."}</p>
        </div>
        <img className="memo-img" src={imgUrl} />
        <div className="memo-container" ref={memoElRef}>
          <span className="time-text">{memo.createdAtStr}</span>
          <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formattedContent }}></div>
          {imageUrls.length > 0 ? (
            <div className="images-container">
              {imageUrls.map((imgUrl, idx) => (
                <img
                  key={idx}
                  crossOrigin="anonymous"
                  src={imgUrl}
                  onLoad={handleImageOnLoad}
                  onError={handleImageOnLoad}
                  decoding="async"
                />
              ))}
            </div>
          ) : null}
          <div className="watermark-container">
            <span className="normal-text">
              via <span className="name-text">{userinfo?.username}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default function showGenMemoImageDialog(memo: Model.Memo) {
  showDialog(
    {
      className: "gen-memo-image-dialog",
    },
    GenMemoImageDialog,
    { memo }
  );
}
