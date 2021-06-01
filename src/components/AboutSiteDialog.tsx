import React from "react";
import { showDialog } from "./Dialog";
import "../less/about-site-dialog.less";

interface Props extends DialogProps {}

const AboutSiteDialog: React.FunctionComponent<Props> = (props: Props) => {
  const { destroy } = props;

  const handleCloseBtnClick = () => {
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">😀</span>关于
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <p>
          <i>(暂无名)</i> ：
          <a target="_blank" href="https://flomoapp.com/">
            flomo
          </a>{" "}
          +{" "}
          <a target="_blank" href="https://www.zsxq.com/">
            知识星球
          </a>
        </p>
        <blockquote>
          <p>
            <b>降低输入摩擦，提高输入动机。</b>
          </p>
          <p>尽量多的无压力的记录下来自己的想法。</p>
          --- flomo
        </blockquote>
        <p>Features:</p>
        <ul>
          <li>
            ✨ 完全开源，
            <a target="_blank" href="https://github.com/boojack/insmemo/">
              项目地址
            </a>
            ；
          </li>
          <li>😋 更可观的视觉样式；</li>
          <li>📑 更好的交互逻辑；</li>
          <li>
            <a target="_blank" href="https://github.com/boojack/insmemo/issues/new">
              🐛 问题反馈
            </a>
          </li>
        </ul>
        <hr />
        <p>Enjoy it and have fun~</p>
        <p className="tip-text">last update at 2021/6/1 11:15:01 v1.1.2</p>
      </div>
    </>
  );
};

export function showAboutSiteDialog() {
  showDialog(
    {
      className: "about-site-dialog",
    },
    AboutSiteDialog,
    {}
  );
}
