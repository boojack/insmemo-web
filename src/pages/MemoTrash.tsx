import { useCallback, useContext, useEffect, useState } from "react";
import appContext from "../stores/appContext";
import useLoading from "../hooks/useLoading";
import { globalStateService, locationService, memoService, queryService } from "../services";
import { IMAGE_URL_REG, LINK_REG, MEMO_LINK_REG, TAG_REG } from "../helpers/consts";
import utils from "../helpers/utils";
import { checkShouldShowMemoWithFilters } from "../helpers/filter";
import Only from "../components/common/OnlyWhen";
import toastHelper from "../components/Toast";
import DeletedMemo from "../components/DeletedMemo";
import MemoFilter from "../components/MemoFilter";
import "../less/memo-trash.less";

interface Props {}

const MemoTrash: React.FC<Props> = () => {
  const {
    locationState: { query },
    globalState: { isMobileView },
  } = useContext(appContext);
  const loadingState = useLoading();
  const [deletedMemos, setDeletedMemos] = useState<Model.Memo[]>([]);

  const { tag: tagQuery, duration, type: memoType, text: textQuery, filter: queryId } = query;
  const queryFilter = queryService.getQueryById(queryId);
  const showMemoFilter = Boolean(tagQuery || (duration && duration.from < duration.to) || memoType || textQuery || queryFilter);

  const shownMemos =
    showMemoFilter || queryFilter
      ? deletedMemos.filter((memo) => {
          let shouldShow = true;

          if (queryFilter) {
            const filters = JSON.parse(queryFilter.querystring) as Filter[];
            if (Array.isArray(filters)) {
              shouldShow = checkShouldShowMemoWithFilters(memo, filters);
            }
          }

          if (tagQuery && !memo.content.includes(`# ${tagQuery}`)) {
            shouldShow = false;
          }
          if (
            duration &&
            duration.from < duration.to &&
            (utils.getTimeStampByDate(memo.createdAt) < duration.from || utils.getTimeStampByDate(memo.createdAt) > duration.to)
          ) {
            shouldShow = false;
          }
          if (memoType) {
            if (memoType === "NOT_TAGGED" && memo.content.match(TAG_REG) !== null) {
              shouldShow = false;
            } else if (memoType === "LINKED" && memo.content.match(LINK_REG) === null) {
              shouldShow = false;
            } else if (memoType === "IMAGED" && memo.content.match(IMAGE_URL_REG) === null) {
              shouldShow = false;
            } else if (memoType === "CONNECTED" && memo.content.match(MEMO_LINK_REG) === null) {
              shouldShow = false;
            }
          }
          if (textQuery && !memo.content.includes(textQuery)) {
            shouldShow = false;
          }

          return shouldShow;
        })
      : deletedMemos;

  useEffect(() => {
    memoService.fetchAllMemos();
    memoService
      .fetchDeletedMemos()
      .then((result) => {
        if (result !== false) {
          setDeletedMemos(result);
        }
      })
      .catch((error) => {
        toastHelper.error("Failed to fetch deleted memos: ", error);
      })
      .finally(() => {
        loadingState.setFinish();
      });
    locationService.clearQuery();
  }, []);

  const handleDeletedMemoAction = useCallback((memoId: string) => {
    setDeletedMemos((deletedMemos) => deletedMemos.filter((memo) => memo.id !== memoId));
  }, []);

  const handleShowSidebarBtnClick = useCallback(() => {
    globalStateService.setShowSiderbarInMobileView(true);
  }, []);

  return (
    <div className="memo-trash-wrapper">
      <div className="section-header-container">
        <div className="title-text">
          <Only when={isMobileView}>
            <button className="action-btn" onClick={handleShowSidebarBtnClick}>
              <img className="icon-img" src="/icons/menu.svg" alt="menu" />
            </button>
          </Only>
          <span className="normal-text">回收站</span>
        </div>
      </div>
      <MemoFilter />
      {loadingState.isLoading ? (
        <div className="tip-text-container">
          <p className="tip-text">努力请求数据中...</p>
        </div>
      ) : deletedMemos.length === 0 ? (
        <div className="tip-text-container">
          <p className="tip-text">Here is No Zettels.</p>
        </div>
      ) : (
        <div className="deleted-memos-container">
          {shownMemos.map((memo) => (
            <DeletedMemo key={`${memo.id}-${memo.updatedAt}`} memo={memo} handleDeletedMemoAction={handleDeletedMemoAction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoTrash;
