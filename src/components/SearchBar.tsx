import React, { useContext, useEffect, useRef } from "react";
import { MEMO_TYPES } from "../helpers/consts";
import { locationService } from "../services";
import appContext from "../labs/appContext";
import { showDialog } from "./Dialog";
import "../less/search-bar.less";

interface Props extends DialogProps {}

const SearchBar: React.FC<Props> = ({ destroy }) => {
  const {
    locationState: {
      query: { text: textQuery, type: memoType },
    },
  } = useContext(appContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleMemoTypeItemClick = (type: MemoType | "") => {
    const { type: prevType } = locationService.getState().query;
    if (type === prevType) {
      type = "";
    }
    locationService.setMemoTypeQuery(type);
  };

  const handleTextQueryInput = (event: React.FormEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value;
    locationService.setTextQuery(text);
  };

  const handleTextQueryKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      destroy();
    }
  };

  return (
    <>
      <div className="search-bar-inputer">
        <img className="icon-img" src="/icons/search.svg" />
        <input
          className="text-input"
          type="text"
          placeholder="Enter the keyword"
          ref={inputRef}
          value={textQuery}
          onChange={handleTextQueryInput}
          onKeyPress={handleTextQueryKeyPress}
        />
      </div>
      <div className="special-type-selector">
        <p className="title-text">Quick Actions</p>
        <div className="types-container">
          {MEMO_TYPES.map((t) => {
            return (
              <span
                key={t.type}
                className={`memo-type-item ${memoType === t.type ? "selected" : ""}`}
                onClick={() => {
                  handleMemoTypeItemClick(t.type as MemoType);
                }}
              >
                {t.text}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

const toggleSearchBarDialog = (() => {
  let searchBarInstance: DialogCallback | null = null;

  return () => {
    if (document.querySelector("search-bar-wrapper") && searchBarInstance) {
      searchBarInstance.destroy();
      searchBarInstance = null;
    } else {
      searchBarInstance = showDialog(
        {
          className: "search-bar-wrapper",
          useAppContext: true,
        },
        SearchBar,
        {}
      );
    }
  };
})();

export default toggleSearchBarDialog;
