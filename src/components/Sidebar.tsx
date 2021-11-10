import { useCallback, useContext, useEffect } from "react";
import appContext from "../stores/appContext";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import UserBanner from "./UserBanner";
import QueryList from "./QueryList";
import TagList from "./TagList";
import UsageHeatMap from "./UsageHeatMap";
import "../less/siderbar.less";

const removeMobileAdditionClass = () => {
  const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);
  pageContainerEl?.classList.remove(MOBILE_ADDITION_CLASSNAME);
};

interface Props {}

const Sidebar: React.FC<Props> = () => {
  const { locationState } = useContext(appContext);

  useEffect(() => {
    removeMobileAdditionClass();
  }, [locationState]);

  const handleWrapperClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (event.target && (event.target as HTMLElement).className === "sidebar-wrapper") {
      removeMobileAdditionClass();
    }
  }, []);

  return (
    <aside className="sidebar-wrapper" onClick={handleWrapperClick}>
      <UserBanner />
      <UsageHeatMap />
      <QueryList />
      <TagList />
    </aside>
  );
};

export default Sidebar;
