import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { userService } from "../helpers/userService";
import { useToggle } from "../hooks/useToggle";
import { showDialog } from "./Dialog";
import { MemoItem } from "./Memo";
import CloseIcon from "../assets/icons/close.svg";
import "../less/gen-memo-image-dialog.less";

interface Props {
  destory: FunctionType;
  memo: MemoItem;
}

const GenMemoImageDialog: React.FunctionComponent<Props> = (props: Props) => {
  const { memo, destory } = props;
  const [imgUrl, setImgUrl] = useState("");
  const [isGenerating, toggleStatus] = useToggle(true);
  const userinfo = userService.getUserInfo();
  const memoElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const memoEl = memoElRef.current;
    if (memoEl) {
      html2canvas(memoEl, {
        scale: 4,
      }).then((canvas) => {
        setImgUrl(canvas.toDataURL());
        toggleStatus();
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
          <span className="icon-text">😀</span>
          {isGenerating ? "生成中" : "分享卡片"}
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src={CloseIcon} />
        </button>
      </div>
      <div className="dialog-content-container" ref={memoElRef}>
        {imgUrl ? (
          <img className="memo-img" src={imgUrl} />
        ) : (
          <>
            <span className="time-text">{memo.createdAtStr}</span>
            <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: memo.formatedContent }}></div>
            <div className="watermark-container">
              <span className="normal-text">
                via <span className="name-text">{userinfo?.username}</span>
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export function showGenMemoImageDialog(memo: MemoItem) {
  showDialog(
    {
      className: "gen-memo-image-dialog",
    },
    GenMemoImageDialog,
    { memo }
  );
}
