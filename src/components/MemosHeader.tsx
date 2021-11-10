import { useCallback, useContext, useEffect, useState } from "react";
import appContext from "../stores/appContext";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import SearchBar from "./SearchBar";
import { memoService, queryService } from "../services";
import "../less/memos-header.less";

interface Props {}

const MemosHeader: React.FC<Props> = () => {
  const {
    locationState: {
      query: { filter },
    },
    queryState: { queries },
  } = useContext(appContext);

  const [titleText, setTitleText] = useState("MEMOS");

  useEffect(() => {
    const query = queryService.getQueryById(filter);
    if (query) {
      setTitleText(query.title);
    } else {
      setTitleText("MEMOS");
    }
  }, [filter, queries]);

  const handleMemoTextClick = useCallback(() => {
    memoService.fetchAllMemos().catch(() => {
      // do nth
    });
  }, []);

  const handleMoreActionBtnClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);

    if (pageContainerEl) {
      pageContainerEl.classList.add(MOBILE_ADDITION_CLASSNAME);
    }
  }, []);

  return (
    <div className="section-header-container memos-header-container">
      <div className="title-text" onClick={handleMemoTextClick}>
        <button className="action-btn" onClick={handleMoreActionBtnClick}>
          <img className="icon-img" src="/icons/menu.svg" alt="menu" />
        </button>
        <span className="normal-text">{titleText}</span>
      </div>
      <SearchBar />
    </div>
  );
};

export default MemosHeader;
