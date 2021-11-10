import React, { memo, useEffect } from "react";
import useToggle from "../../hooks/useToggle";
import "../../less/common/selector.less";

interface TVObject {
  text: string;
  value: string;
}

interface Props {
  className?: string;
  value: string;
  dataSource: TVObject[];
  handleValueChanged?: (value: string) => void;
}

const nullItem = {
  text: "请选择",
  value: "",
};

const Selector: React.FC<Props> = (props: Props) => {
  const { className, dataSource, handleValueChanged, value } = props;
  const [showSelector, toggleSelectorStatus] = useToggle(false);

  let currentItem = nullItem;
  for (const d of dataSource) {
    if (d.value === value) {
      currentItem = d;
      break;
    }
  }

  useEffect(() => {
    // do nth
  }, []);

  const handleItemClick = (item: TVObject) => {
    if (handleValueChanged) {
      handleValueChanged(item.value);
    }
  };

  const handleCurrentValueClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSelectorStatus();
  };

  const handleSeletorClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSelectorStatus();
  };

  return (
    <div className={`selector-wrapper ${className ?? ""}`} onClick={handleSeletorClick}>
      <div className="current-value-container" onClick={handleCurrentValueClick}>
        <span className="value-text">{currentItem.text}</span>
        <span className="arrow-text">
          <img className="icon-img" src="/icons/arrow-right.svg" />
        </span>
      </div>

      <div className={`items-wrapper ${showSelector ? "" : "hidden"}`}>
        {dataSource.map((d) => {
          return (
            <div
              className={`item-container ${d.value === value ? "selected" : ""}`}
              key={d.value}
              onClick={() => {
                handleItemClick(d);
              }}
            >
              {d.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Selector);
