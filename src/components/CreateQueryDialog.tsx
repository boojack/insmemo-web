import React, { useEffect, useState } from "react";
import { memoService, queryService } from "../services";
import { filterConsts, getDefaultFilter } from "../helpers/filter";
import useLoading from "../hooks/useLoading";
import { showDialog } from "./Dialog";
import toastHelper from "./Toast";
import "../less/create-query-dialog.less";

interface Props extends DialogProps {
  queryId?: string;
}

const CreateQueryDialog: React.FC<Props> = (props: Props) => {
  const { destroy, queryId } = props;

  const [title, setTitle] = useState<string>("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const requestState = useLoading(false);

  useEffect(() => {
    const queryTemp = queryService.getQueryById(queryId ?? "");
    if (queryTemp) {
      setTitle(queryTemp.title);
      const temp = JSON.parse(queryTemp.querystring);
      if (Array.isArray(temp)) {
        setFilters(temp);
      }
    }
  }, [queryId]);

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setTitle(text);
  };

  const handleSaveBtnClick = async () => {
    if (!title) {
      toastHelper.error("标题不能为空！");
      return;
    }

    try {
      if (queryId) {
        const editedQuery = await queryService.updateQuery(queryId, title, JSON.stringify(filters));
        queryService.editQuery(editedQuery);
      } else {
        const query = await queryService.createQuery(title, JSON.stringify(filters));
        queryService.pushQuery(query);
      }
    } catch (error: any) {
      toastHelper.error(error.message);
    }
    destroy();
  };

  const handleAddFilterBenClick = () => {
    if (filters.length > 0) {
      const lastFilter = filters[filters.length - 1];
      if (lastFilter.value.value === "") {
        toastHelper.info("先完善上一个过滤器吧");
        return;
      }
    }

    setFilters([...filters, getDefaultFilter()]);
  };

  const handleFilterChange = (index: number, filter: Filter) => {
    const temp = [...filters];
    temp[index] = filter;
    setFilters(temp);
  };

  const handleFilterRemove = (index: number) => {
    const temp = filters.filter((_, i) => i !== index);
    setFilters(temp);
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🔖</span>
          {queryId ? "编辑检索" : "创建检索"}
        </p>
        <button className="btn close-btn" onClick={destroy}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <div className="form-item-container input-form-container">
          <span className="normal-text">标题</span>
          <input className="title-input" type="text" value={title} onChange={handleTitleInputChange} />
        </div>
        <div className="form-item-container filter-form-container">
          <span className="normal-text">过滤器</span>
          <div className="filters-wrapper">
            {filters.map((f, index) => {
              return (
                <MemoFilterInput
                  key={`${index}-${Date.now()}`}
                  index={index}
                  filter={f}
                  handleFilterChange={handleFilterChange}
                  handleFilterRemove={handleFilterRemove}
                />
              );
            })}
            <div className="create-filter-btn" onClick={handleAddFilterBenClick}>
              添加筛选条件
            </div>
          </div>
        </div>
      </div>
      <div className="dialog-footer-container">
        <div></div>
        <div className="btns-container">
          <button className={`btn save-btn ${requestState.isLoading ? "requesting" : ""}`} onClick={handleSaveBtnClick}>
            保存
          </button>
        </div>
      </div>
    </>
  );
};

interface MemoFilterInputProps {
  index: number;
  filter: Filter;
  handleFilterChange: (index: number, filter: Filter) => void;
  handleFilterRemove: (index: number) => void;
}

const MemoFilterInput: React.FC<MemoFilterInputProps> = (props: MemoFilterInputProps) => {
  const { index, filter, handleFilterChange, handleFilterRemove } = props;
  const { type } = filter;
  const [inputElements, setInputElements] = useState<JSX.Element>(<></>);

  useEffect(() => {
    let operatorElement = <></>;
    if (Object.keys(filterConsts).includes(type)) {
      operatorElement = (
        <select className="operator-selector" value={filter.value.operator} onChange={handleOperatorChange}>
          {filterConsts[type as FilterType].operators.map((t) => {
            return (
              <option key={t.value} value={t.value}>
                {t.text}
              </option>
            );
          })}
        </select>
      );
    }

    let valueElement = <></>;
    switch (type) {
      case "TYPE": {
        valueElement = (
          <select className="value-selector" value={filter.value.value} onChange={handleValueChange}>
            <option value=""></option>
            {filterConsts["TYPE"].values.map((t) => {
              return (
                <option key={t.value} value={t.value}>
                  {t.text}
                </option>
              );
            })}
          </select>
        );
        break;
      }
      case "TAG": {
        valueElement = (
          <select className="value-selector" value={filter.value.value} onChange={handleValueChange}>
            <option value=""></option>
            {memoService.getState().tags.map((t) => {
              return (
                <option key={t} value={t}>
                  {t}
                </option>
              );
            })}
          </select>
        );
        break;
      }
      case "TEXT": {
        valueElement = (
          <input className="value-inputer" value={filter.value.value} onChange={handleValueChange} type="text" name="" id="" />
        );
        break;
      }
    }

    setInputElements(
      <>
        {operatorElement}
        {valueElement}
      </>
    );
  }, [type, filter]);

  const handleRelationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const relation = event.target.value;

    if (["AND", "OR"].includes(relation)) {
      handleFilterChange(index, {
        ...filter,
        relation: relation as MemoFilterRalation,
      });
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value as FilterType;
    handleFilterChange(index, {
      ...filter,
      type,
    });
  };

  const handleOperatorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const operator = event.target.value;
    handleFilterChange(index, {
      ...filter,
      value: {
        ...filter.value,
        operator,
      },
    });
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = event.target.value as FilterType;
    handleFilterChange(index, {
      ...filter,
      value: {
        ...filter.value,
        value,
      },
    });
  };

  const handleRemoveBtnClick = () => {
    handleFilterRemove(index);
  };

  return (
    <div className="memo-filter-input-wrapper">
      {index > 0 ? (
        <select className="relation-selector" onChange={handleRelationChange} value={props.filter.relation}>
          <option value="AND">且</option>
          <option value="OR">或</option>
        </select>
      ) : null}
      <select className="type-selector" onChange={handleTypeChange} value={type}>
        {Object.values(filterConsts).map((t) => {
          return (
            <option key={t.value} value={t.value}>
              {t.text}
            </option>
          );
        })}
      </select>
      {inputElements}
      <img className="remove-btn" src="/icons/close.svg" onClick={handleRemoveBtnClick} />
    </div>
  );
};

export default function showCreateQueryDialog(queryId?: string): void {
  showDialog(
    {
      className: "create-query-dialog",
    },
    CreateQueryDialog,
    { queryId }
  );
}
