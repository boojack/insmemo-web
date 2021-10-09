import { useEffect, useRef, useState } from "react";
import { globalStateService, userService } from "../services";
import { ANIMATION_DURATION, IMAGE_URL_REG } from "../helpers/consts";
import { utils } from "../helpers/utils";
import { showDialog } from "./Dialog";
import Only from "./common/OnlyWhen";
import { formatMemoContent } from "./Memo";
import toastHelper from "./Toast";
import "../less/share-memo-image-dialog.less";

interface Props extends DialogProps {
  memo: Model.Memo;
}

const ShareMemoImageDialog: React.FC<Props> = (props) => {
  const { memo: propsMemo, destroy } = props;
  const [imgUrl, setImgUrl] = useState("");
  const memoElRef = useRef<HTMLDivElement>(null);
  const { user: userinfo } = userService.getState();
  const memo: FormattedMemo = {
    ...propsMemo,
    formattedContent: formatMemoContent(propsMemo.content),
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };
  const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);
  const [imageAmount, setImageAmount] = useState(imageUrls.length);

  useEffect(() => {
    setTimeout(() => {
      if (imageAmount === 0) {
        const osVersion = utils.getOSVersion();
        if (osVersion === "MacOS" || osVersion === "Unknown") {
          window.scrollTo(0, 0);
        }

        html2canvas(memoElRef.current!, {
          scale: window.devicePixelRatio * 2,
          allowTaint: true,
          useCORS: true,
          backgroundColor: globalStateService.getState().showDarkMode ? "#2f3437" : "white",
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
        }).then((canvas) => {
          setImgUrl(canvas.toDataURL());
        });
      }
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
          <Only when={imageUrls.length > 0}>
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
          </Only>
          <div className="watermark-container">
            <span className="normal-text">
              by <span className="name-text">{userinfo?.username}</span>
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
