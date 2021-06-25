import React, { useEffect, useRef, useState } from "react";
import { ANIMATION_DURATION } from "../helpers/consts";
import userService from "../helpers/userService";
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
          html2canvas(memoEl, {
            scale: 4,
            backgroundColor: storage.preferences.showDarkMode ? "#2f3437" : "white",
            useCORS: true,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
          }).then((canvas) => {
            setImgUrl(canvas.toDataURL());
          });
        }
      }, ANIMATION_DURATION);
    }
  }, [imageAmount]);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleImageOnLoad = () => {
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
        {imgUrl ? (
          <>
            <p className="tip-text">右键或长按即可保存图片 👇</p>
            <img className="memo-img" src={imgUrl} />
          </>
        ) : (
          <>
            <div className="cover-container">
              <p className="loading-text">图片生成中...</p>
            </div>
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
          </>
        )}
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
