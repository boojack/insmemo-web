import { useCallback } from "react";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import SearchBar from "./SearchBar";
import { locationService } from "../services";
import "../less/memos-header.less";

interface Props {}

const MemosHeader: React.FC<Props> = () => {
  const handleMemoTextClick = useCallback(() => {
    locationService.clearQuery();
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
        <span className="normal-text">MEMOS</span>
      </div>
      <SearchBar />
    </div>
  );
};

export default MemosHeader;
