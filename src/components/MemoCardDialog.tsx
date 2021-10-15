import { useState, useEffect } from "react";
import { IMAGE_URL_REG, MEMO_LINK_REG } from "../helpers/consts";
import { utils } from "../helpers/utils";
import { memoService } from "../services";
import { showDialog } from "./Dialog";
import Only from "./common/OnlyWhen";
import { formatMemoContent } from "./Memo";
import Image from "./Image";
import "../less/memo-card-dialog.less";

interface LinkedMemo extends FormattedMemo {
  dateStr: string;
}

interface Props extends DialogProps {
  memoId: string;
}

const MemoCardDialog: React.FC<Props> = (props) => {
  const [memoId, setMemoId] = useState<string>(props.memoId);
  const [prevMemoIds, setPrevMemoIds] = useState<string[]>([]);
  const [memo, setMemo] = useState<FormattedMemo>();
  const [linkMemoIds, setLinkMemoIds] = useState<string[]>([]);
  const [linkedMemos, setLinkedMemos] = useState<LinkedMemo[]>([]);
  const imageUrls = Array.from(memo?.content.match(IMAGE_URL_REG) ?? []);

  useEffect(() => {
    const fetchMemo = async () => {
      const memoTemp = await memoService.getMemoById(memoId);

      if (memoTemp) {
        const linkMemoIds: string[] = [];
        const matchedArr = [...memoTemp.content.matchAll(MEMO_LINK_REG)];

        for (const matchRes of matchedArr) {
          if (matchRes && matchRes.length === 3) {
            const id = matchRes[2];
            const memoTemp = await memoService.getMemoById(id);

            if (memoTemp) {
              linkMemoIds.push(id);
            }
          }
        }

        const linkedMemos = await memoService.getLinkedMemos(memoId);

        setMemo({
          ...memoTemp,
          formattedContent: formatMemoContent(memoTemp.content),
          createdAtStr: utils.getDateTimeString(memoTemp.createdAt),
        });
        setLinkMemoIds([...linkMemoIds]);
        setLinkedMemos(
          linkedMemos.map((m) => ({
            ...m,
            formattedContent: formatMemoContent(m.content),
            createdAtStr: utils.getDateTimeString(m.createdAt),
            dateStr: utils.getDateString(m.createdAt),
          }))
        );
      } else {
        props.destroy();
      }
    };

    fetchMemo();
  }, [memoId]);

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === "memo-link-text") {
      const nextMemoId = targetEl.dataset?.value;

      if (nextMemoId) {
        setMemoId(nextMemoId);
        setPrevMemoIds([...prevMemoIds, memoId]);
      }
    }
  };

  const handleBackBtnClick = () => {
    const prevMemoId = prevMemoIds.pop();
    if (prevMemoId) {
      setMemoId(prevMemoId);
      setPrevMemoIds(prevMemoIds);
    }
  };

  const handleLinkedMemoClick = (id: string) => {
    setMemoId(id);
    setPrevMemoIds([...prevMemoIds, memoId]);
  };

  return (
    <>
      <div className="memo-card-container">
        <div className="header-container">
          <p className="time-text">{memo?.createdAtStr}</p>
          <div className="btns-container">
            <button className={`text-btn ${prevMemoIds.length === 0 ? "hidden" : ""}`} onClick={handleBackBtnClick}>
              <img className="icon-img" src="/icons/arrow-left.svg" />
            </button>
            <button className="text-btn close-btn" onClick={props.destroy}>
              <img className="icon-img" src="/icons/close.svg" />
            </button>
          </div>
        </div>
        <div className="memo-container">
          <div
            className="memo-content-text"
            onClick={handleMemoContentClick}
            dangerouslySetInnerHTML={{ __html: memo?.formattedContent ?? "" }}
          ></div>
          <Only when={imageUrls.length > 0}>
            <div className="images-wrapper">
              {imageUrls.map((imgUrl, idx) => (
                <Image className="memo-img" key={idx} imgUrl={imgUrl} />
              ))}
            </div>
          </Only>
        </div>
        <p className={"normal-text " + (linkMemoIds.length === 0 ? "hidden" : "")}>关联了 {linkMemoIds.length} 个 MEMO</p>
        <div className="layer-container"></div>
        {linkMemoIds.map((_, idx) => {
          if (idx < 4) {
            return (
              <div
                className="background-layer-container"
                style={{
                  bottom: (idx + 1) * -3 + "px",
                  left: (idx + 1) * 3 + "px",
                  width: `calc(100% - ${(idx + 1) * 6}px)`,
                  zIndex: -idx - 1,
                }}
              ></div>
            );
          } else {
            return null;
          }
        })}
      </div>
      {linkedMemos.length > 0 ? (
        <div className="linked-memos-wrapper">
          <p className="normal-text">{linkedMemos.length} 个链接至此的 MEMO</p>
          {linkedMemos.map((m) => (
            <div className="linked-memo-container" onClick={() => handleLinkedMemoClick(m.id)}>
              <span className="time-text">{m.dateStr}: </span>
              <div className="content-text" dangerouslySetInnerHTML={{ __html: m.formattedContent ?? "" }}></div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default function showMemoCardDialog(memoId: string): void {
  showDialog(
    {
      className: "memo-card-dialog",
    },
    MemoCardDialog,
    { memoId }
  );
}
