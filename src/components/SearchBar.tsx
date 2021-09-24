import React, { useEffect, useRef, useState } from "react";
import useToggle from "../hooks/useToggle";
import { MEMO_TYPES } from "../helpers/consts";
import { locationService } from "../services";
import "../less/search-bar.less";

interface Props {}

const SearchBar: React.FC<Props> = () => {
  const [memoType, setMemoType] = useState("");
  const [textQuery, setTextQuery] = useState("");
  const [showSearchBar, toggleShowSearchBar] = useToggle(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSearchKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, code } = event;
      if ((ctrlKey || metaKey) && code === "KeyP") {
        event.preventDefault();
        toggleShowSearchBar();
      }
    };

    window.addEventListener("keydown", handleSearchKeyDown);

    return () => {
      window.removeEventListener("keydown", handleSearchKeyDown);
    };
  }, []);

  useEffect(() => {
    if (showSearchBar) {
      inputRef.current?.focus();
      const { query } = locationService.getState();
      setMemoType(query.type);
      setTextQuery(query.text);
    }
  }, [showSearchBar]);

  const handleMemoTypeItemClick = (type: MemoType | "") => {
    const { type: prevType } = locationService.getState().query;
    if (type === prevType) {
      type = "";
    }
    setMemoType(type);
    locationService.setMemoTypeQuery(type);
  };

  const handleTextQueryInput = (event: React.FormEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value;
    setTextQuery(text);
    locationService.setTextQuery(text);
  };

  const handleTextQueryKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      toggleShowSearchBar(false);
    }
  };

  return (
    <div className={`search-bar-wrapper ${showSearchBar ? "showup" : "showoff"}`} onClick={() => toggleShowSearchBar()}>
      <div className="search-bar-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-bar-inputer">
          <img className="icon-img" src="/icons/search.svg" />
          <input
            className="text-input"
            type="text"
            placeholder="想搜啥"
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
      </div>
    </div>
  );
};

export default SearchBar;
