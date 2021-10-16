import { useCallback, useContext, useEffect } from "react";
import appContext from "../labs/appContext";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import UserBanner from "./UserBanner";
import TagList from "./TagList";
import UsageHeatMap from "./UsageHeatMap";
import "../less/siderbar.less";

interface Props {}

const Sidebar: React.FC<Props> = () => {
  const { locationState } = useContext(appContext);

  useEffect(() => {
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
    pageContainerEl?.classList.remove(MOBILE_ADDITION_CLASSNAME);
  }, [locationState]);

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
    <aside className="sidebar-wrapper" onClick={handleWrapperClick}>
      <UserBanner />
      <UsageHeatMap />
      <TagList />
    </aside>
  );
};

export default Sidebar;
