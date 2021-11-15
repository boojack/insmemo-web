import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { userService } from "../services";
import { ANIMATION_DURATION, IMAGE_URL_REG } from "../helpers/consts";
import utils from "../helpers/utils";
import { showDialog } from "./Dialog";
import { formatMemoContent } from "./Memo";
import Only from "./common/OnlyWhen";
import toastHelper from "./Toast";
import "../less/share-memo-image-dialog.less";

interface Props extends DialogProps {
  memo: Model.Memo;
}

const ShareMemoImageDialog: React.FC<Props> = (props: Props) => {
  const { memo: propsMemo, destroy } = props;
  const [imgUrl, setImgUrl] = useState("");
  const memoElRef = useRef<HTMLDivElement>(null);
  const { user: userinfo } = userService.getState();
  const memo: FormattedMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };
  const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
  const [imageAmount, setImageAmount] = useState(imageUrls.length);

  useEffect(() => {
    if (imageAmount > 0) {
      return;
    }

    setTimeout(() => {
      toPng(memoElRef.current!, {
        backgroundColor: "#f8f8f8",
        cacheBust: true,
        pixelRatio: 3,
      }).then((url) => {
        setImgUrl(url);
        memoElRef.current?.remove();
      });
    }, ANIMATION_DURATION + 100);
  }, [imageAmount]);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleImageOnLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    if (ev.type === "error") {
      toastHelper.error("有个图片加载失败了😟");
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
        <button className="btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <div className={`tip-words-container ${imgUrl ? "finish" : "loading"}`}>
          <p className="tip-text">{imgUrl ? "右键或长按即可保存图片 👇" : "图片生成中..."}</p>
        </div>
        <img className="memo-img" src={imgUrl} />
        <div className="memo-container" ref={memoElRef}>
          <span className="time-text">{memo.createdAtStr}</span>
          <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: formatMemoContent(memo.content) }}></div>
          <Only when={imageUrls.length > 0}>
            <div className="images-container">
              {imageUrls.map((imgUrl, idx) => (
                <img
                  crossOrigin="anonymous"
                  decoding="async"
                  key={idx}
                  src={imgUrl}
                  onLoad={handleImageOnLoad}
                  onError={handleImageOnLoad}
                />
              ))}
            </div>
          </Only>
          <div className="watermark-container">
            <span className="normal-text">
              ✍️ Memo by <span className="name-text">{userinfo?.username}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default function showShareMemoImageDialog(memo: Model.Memo): void {
  showDialog(
    {
      className: "share-memo-image-dialog",
    },
    ShareMemoImageDialog,
    { memo }
  );
}
