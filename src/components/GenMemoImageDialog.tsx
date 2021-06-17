import React, { useEffect, useRef, useState } from "react";
import userService from "../helpers/userService";
import { utils } from "../helpers/utils";
import { showDialog } from "./Dialog";
import { formatMemoContent } from "./Memo";
import "../less/gen-memo-image-dialog.less";

interface Props extends DialogProps {
  memo: Model.Memo;
}

const GenMemoImageDialog: React.FunctionComponent<Props> = (props) => {
  const { memo: propsMemo, destroy } = props;
  const [imgUrl, setImgUrl] = useState("");
  const { user: userinfo } = userService.getState();
  const memoElRef = useRef<HTMLDivElement>(null);
  const memo: FormattedMemo = {
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getTimeString(propsMemo.createdAt),
  };

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
    destroy();
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
