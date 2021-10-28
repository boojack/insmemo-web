import { useEffect, useState } from "react";
import { locationService, queryService } from "../services";
import * as utils from "../helpers/utils";
import { showDialog } from "./Dialog";
import "../less/create-query-dialog.less";
import toastHelper from "./Toast";

interface Props extends DialogProps {
  queryId?: string;
}

const CreateQueryDialog: React.FC<Props> = (props: Props) => {
  const { destroy, queryId } = props;
  const { query } = locationService.getState();

  const [title, setTitle] = useState<string>("");
  const [querystring, setQuerystring] = useState<string>(JSON.stringify(utils.filterObjectNullKeys(query)));

  useEffect(() => {
    const queryTemp = queryService.getQueryById(queryId ?? "");
    if (queryTemp) {
      setTitle(queryTemp.title);
      setQuerystring(queryTemp.querystring);
    }
  }, [queryId]);

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setTitle(text);
  };

  const handleQuerystringTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value as string;
    setQuerystring(text);
  };

  const handleSaveBtnClick = async () => {
    try {
      if (queryId) {
        const editedQuery = await queryService.updateQuery(queryId, title, querystring);
        queryService.editQuery(editedQuery);
      } else {
        const query = await queryService.createQuery(title, querystring);
        queryService.pushQuery(query);
      }
      destroy();
    } catch (error: any) {
      toastHelper.error(error.message);
    }
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">🔖</span>创建索引
        </p>
        <button className="text-btn close-btn" onClick={destroy}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <p className="tip-text">⚠️ 这是一个实验性功能</p>
        <div className="form-item-container input-form-container">
          <span className="normal-text">标题</span>
          <input type="text" value={title} onChange={handleTitleInputChange} />
        </div>
        <div className="form-item-container input-form-container">
          <span className="normal-text">过滤器</span>
          <textarea value={JSON.stringify(JSON.parse(querystring), null, 2)} onChange={handleQuerystringTextareaChange}></textarea>
        </div>
      </div>
      <div className="dialog-footer-container">
        <div></div>
        <div className="btns-container">
          <button className="text-btn save-btn" onClick={handleSaveBtnClick}>
            保存
          </button>
        </div>
      </div>
    </>
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
