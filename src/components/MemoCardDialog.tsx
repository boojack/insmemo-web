import { useState, useEffect, useCallback } from "react";
import { IMAGE_URL_REG, MEMO_LINK_REG } from "../helpers/consts";
import { utils } from "../helpers/utils";
import { globalStateService, memoService } from "../services";
import { parseHtmlToRawText } from "../helpers/marked";
import { formatMemoContent } from "./Memo";
import toastHelper from "./Toast";
import { showDialog } from "./Dialog";
import Only from "./common/OnlyWhen";
import Image from "./Image";
import "../less/memo-card-dialog.less";

interface LinkedMemo extends FormattedMemo {
  dateStr: string;
}

interface Props extends DialogProps {
  memo: Model.Memo;
}

const MemoCardDialog: React.FC<Props> = (props) => {
  const [memo, setMemo] = useState<FormattedMemo>({
    ...props.memo,
    formattedContent: formatMemoContent(props.memo.content),
    createdAtStr: utils.getDateTimeString(props.memo.createdAt),
  });
  const [linkMemoIds, setLinkMemoIds] = useState<string[]>([]);
  const [linkedMemos, setLinkedMemos] = useState<LinkedMemo[]>([]);
  const imageUrls = Array.from(memo.content.match(IMAGE_URL_REG) ?? []);

  useEffect(() => {
    const fetchLinkedMemos = async () => {
      try {
        const linkMemoIds: string[] = [];
        const matchedArr = [...memo.content.matchAll(MEMO_LINK_REG)];
        for (const matchRes of matchedArr) {
          if (matchRes && matchRes.length === 3) {
            const id = matchRes[2];
            const memoTemp = await memoService.getMemoById(id);
            if (memoTemp) {
              linkMemoIds.push(id);
            }
          }
        }
        setLinkMemoIds([...linkMemoIds]);

        const linkedMemos = await memoService.getLinkedMemos(memo.id);
        setLinkedMemos(
          linkedMemos
            .sort((a, b) => utils.getTimeStampByDate(b.createdAt) - utils.getTimeStampByDate(a.createdAt))
            .map((m) => ({
              ...m,
              formattedContent: formatMemoContent(m.content),
              createdAtStr: utils.getDateTimeString(m.createdAt),
              dateStr: utils.getDateString(m.createdAt),
            }))
        );
      } catch (error) {
        // do nth
      }
    };

    fetchLinkedMemos();
  }, [memo.id]);

  const handleMemoContentClick = useCallback(async (e: React.MouseEvent) => {
    const targetEl = e.target as HTMLElement;

    if (targetEl.className === "memo-link-text") {
      const nextMemoId = targetEl.dataset?.value;
      const memoTemp = await memoService.getMemoById(nextMemoId ?? "");

      if (memoTemp) {
        const nextMemo = {
          ...memoTemp,
          formattedContent: formatMemoContent(memoTemp.content),
          createdAtStr: utils.getDateTimeString(memoTemp.createdAt),
        };
        setLinkedMemos([]);
        setMemo(nextMemo);
      } else {
        toastHelper.error("MEMO Not Found");
        targetEl.classList.remove("memo-link-text");
      }
    }
  }, []);

  const handleLinkedMemoClick = useCallback((memo: FormattedMemo) => {
    setLinkedMemos([]);
    setMemo(memo);
  }, []);

  const handleEditMemoBtnClick = useCallback(() => {
    props.destroy();
    globalStateService.setEditMemoId(memo.id);
  }, [memo.id]);

  return (
    <>
      <div className="memo-card-container">
        <div className="header-container">
          <p className="time-text">{memo.createdAtStr}</p>
          <div className="btns-container">
            <button className="text-btn edit-btn" onClick={handleEditMemoBtnClick}>
              <img className="icon-img" src="/icons/edit.svg" />
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
            dangerouslySetInnerHTML={{ __html: memo.formattedContent ?? "" }}
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
                key={idx}
                style={{
                  bottom: (idx + 1) * -3 + "px",
                  left: (idx + 1) * 5 + "px",
                  width: `calc(100% - ${(idx + 1) * 10}px)`,
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
          <p className="normal-text">{linkedMemos.length} 条链接至此的 MEMO</p>
          {linkedMemos.map((m) => {
            const rawtext = parseHtmlToRawText(m.formattedContent).replaceAll("\n", " ");

            return (
              <div className="linked-memo-container" key={m.id} onClick={() => handleLinkedMemoClick(m)}>
                <span className="time-text">{m.dateStr}: </span>
                {rawtext}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default function showMemoCardDialog(memo: Model.Memo): void {
  showDialog(
    {
      className: "memo-card-dialog",
    },
    MemoCardDialog,
    { memo }
  );
}
