import { useEffect, useRef, useState } from "react";
import { toPng, toSvg } from "html-to-image";
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
  const { user: userinfo } = userService.getState();
  const memo: FormattedMemo = {
    ...propsMemo,
    createdAtStr: utils.getDateTimeString(propsMemo.createdAt),
  };
  const memoImgUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  const [shortcutImgUrl, setShortcutImgUrl] = useState("");
  const [imgAmount, setImgAmount] = useState(memoImgUrls.length);
  const memoElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imgAmount > 0) {
      return;
    }

    setTimeout(() => {
      toSvg(memoElRef.current!, {
        backgroundColor: "#f8f8f8",
        cacheBust: true,
        pixelRatio: 4,
      }).then((url) => {
        setShortcutImgUrl(url);
        // NOTE 为了可以直接 copy 高清图片，hack 了一下
        toPng(memoElRef.current!, {
          backgroundColor: "#f8f8f8",
          cacheBust: true,
          pixelRatio: 4,
        }).then((url) => {
          setShortcutImgUrl(url);
        });
      });
    }, ANIMATION_DURATION + 100);
  }, [imgAmount]);

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleImageOnLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    if (ev.type === "error") {
      toastHelper.error("有个图片加载失败了😟");
      (ev.target as HTMLImageElement).remove();
    }
    setImgAmount(imgAmount - 1);
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
        <div className={`tip-words-container ${shortcutImgUrl ? "finish" : "loading"}`}>
          <p className="tip-text">{shortcutImgUrl ? "右键或长按即可保存图片 👇" : "图片生成中..."}</p>
        </div>
        <div className="memo-container" ref={memoElRef}>
          <img className={`memo-shortcut-img ${shortcutImgUrl ? "" : "hidden"}`} src={shortcutImgUrl} />
          <span className="time-text">{memo.createdAtStr}</span>
          <div className="memo-content-text" dangerouslySetInnerHTML={{ __html: formatMemoContent(memo.content) }}></div>
          <Only when={memoImgUrls.length > 0}>
            <div className="images-container">
              {memoImgUrls.map((imgUrl, idx) => (
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
