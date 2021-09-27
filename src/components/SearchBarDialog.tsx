import React, { useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { ANIMATION_DURATION, MEMO_TYPES } from "../helpers/consts";
import { locationService } from "../services";
import appContext from "../labs/appContext";
import { showDialog } from "./Dialog";
import "../less/search-bar-dialog.less";

interface Props extends DialogProps {}

const SearchBarDialog: React.FC<Props> = ({ destroy }) => {
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
          placeholder="Search for memos"
          ref={inputRef}
          value={textQuery}
          onChange={handleTextQueryInput}
          onKeyPress={handleTextQueryKeyPress}
        />
      </div>
      <div className="special-type-selector">
        <p className="title-text">QUICKLY FILTER</p>
        <div className="section-container types-container">
          <span className="section-text">Type:</span>
          {MEMO_TYPES.map((t, idx) => {
            return (
              <div key={t.type}>
                <span
                  className={`type-item ${memoType === t.type ? "selected" : ""}`}
                  onClick={() => {
                    handleMemoTypeItemClick(t.type as MemoType);
                  }}
                >
                  {t.text}
                </span>
                {idx + 1 < MEMO_TYPES.length ? <span className="split-text">/</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const toggleSearchBarDialog = (): void => {
  const className = "search-bar-dialog-wrapper";
  const container = document.querySelector(`.${className}`);

  if (container && container.parentElement) {
    container.classList.remove("showup");
    container.classList.add("showoff");
    setTimeout(() => {
      if (container && container.parentElement) {
        container.parentElement.remove();
        ReactDOM.unmountComponentAtNode(container.parentElement);
      }
    }, ANIMATION_DURATION);
  } else {
    showDialog(
      {
        className,
        useAppContext: true,
      },
      SearchBarDialog
    );
  }
};

export default toggleSearchBarDialog;
