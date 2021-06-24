import React from "react";
import { showDialog } from "./Dialog";
import "../less/about-site-dialog.less";

interface Props extends DialogProps {}

const AboutSiteDialog: React.FunctionComponent<Props> = ({ destroy }) => {
  const handleCloseBtnClick = () => {
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">
          <span className="icon-text">😀</span>关于 insmemo
        </p>
        <button className="text-btn close-btn" onClick={handleCloseBtnClick}>
          <img className="icon-img" src="/icons/close.svg" />
        </button>
      </div>
      <div className="dialog-content-container">
        <p>
          <b>insmemo</b>：
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
          <p>尽量多地无压力地记录下来自己的想法。</p>
          --- flomo
        </blockquote>
        <p>Features:</p>
        <ul>
          <li>
            ✨{" "}
            <a target="_blank" href="https://github.com/boojack/insmemo-web">
              开源项目
            </a>
            ，用于学习；
          </li>
          <li>😋 更可观的视觉样式；</li>
          <li>📑 更好的交互逻辑；</li>
          <li>
            🐛{" "}
            <a target="_blank" href="https://github.com/boojack/insmemo-web/issues/new">
              问题反馈
            </a>
            ；
          </li>
        </ul>
        <hr />
        <p>Enjoy it and have fun~</p>
        <p className="normal-text">
          BTW, my personal site:{" "}
          <a target="_blank" href="https://justsven.top">
            https://justsven.top
          </a>{" "}
          👀
        </p>
        <p className="normal-text">Last update at 2021/6/23 11:25:11, v2.0.4</p>
      </div>
    </>
  );
};

export default function showAboutSiteDialog() {
  showDialog(
    {
      className: "about-site-dialog",
    },
    AboutSiteDialog,
    {}
  );
}
