import { useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import UserBanner from "./UserBanner";
import TagList from "./TagList";
import UsageHeatMap from "./UsageHeatMap";
import "../less/siderbar.less";

interface Props {}

const Sidebar: React.FC<Props> = () => {
  const location = useLocation();

  const handleWrapperClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    const el = event.target as HTMLElement;

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
      <div className="nav-btn-container hidden">
        <NavLink className="nav-btn" exact to="/">
          <span className="icon-text">😊</span>
          <span className="btn-text">MEMO</span>
        </NavLink>
      </div>
      <TagList />
      <div className="nav-btn-container recycle-btn">
        <NavLink className="nav-btn" exact to="/trash">
          <img src={location.pathname === "/trash" ? "/icons/trash-white.svg" : "/icons/trash.svg"} className="icon-img" />
          <span className="btn-text">回收站</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
