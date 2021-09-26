import React, { useCallback, useEffect } from "react";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import UserBanner from "./UserBanner";
import TagList from "./TagList";
import UsageHeatMap from "./UsageHeatMap";
import "../less/siderbar.less";

interface Props {}

const Sidebar: React.FC<Props> = () => {
  useEffect(() => {
    // do nth
  }, []);

  const handleWrapperClick = useCallback((ev: React.MouseEvent) => {
    const el = ev.target as HTMLElement;

    if (el.className === "sidebar-wrapper") {
      // 删除移动端样式
      const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
      pageContainerEl?.classList.remove(MOBILE_ADDITION_CLASSNAME);
    }
  }, []);

  return (
    <div className="sidebar-wrapper" onClick={handleWrapperClick}>
      <UserBanner />
      <UsageHeatMap />
      <TagList />
    </div>
  );
};

export default Sidebar;
