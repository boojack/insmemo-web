import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { userService } from "../helpers/userService";
import { showDialog } from "./Dialog";
import CloseIcon from "../assets/icons/close.svg";
import "../less/gen-memo-image-dialog.less";

interface Props extends DialogProps {
  memo: FormatedMemo;
}

const GenMemoImageDialog: React.FunctionComponent<Props> = (props: Props) => {
  const { memo, destory } = props;
  const [imgUrl, setImgUrl] = useState("");
  const userinfo = userService.getUserInfo();
  const memoElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const memoEl = memoElRef.current;
    if (memoEl) {
      html2canvas(memoEl, {
        scale: 4,
      }).then((canvas) => {
        setImgUrl(canvas.toDataURL());
      });
    }
  }, []);

  const handleCloseBtnClick = () => {
    destory();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🥰</span>分享 Memo 图片
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src={CloseIcon} />
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
              <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formatedContent }}></div>
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

export function showGenMemoImageDialog(memo: FormatedMemo) {
  showDialog(
    {
      className: "gen-memo-image-dialog",
    },
    GenMemoImageDialog,
    { memo }
  );
}
