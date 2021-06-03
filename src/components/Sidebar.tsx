import React, { useEffect } from "react";
import UserBanner from "./UserBanner";
import TagList from "./TagList";
import UsageStatTable from "./UsageStatTable";
import "../less/siderbar.less";

const Sidebar: React.FunctionComponent = () => {
  useEffect(() => {
    // do nth
  }, []);

  return (
    <div className="sidebar-wrapper">
      <UserBanner />
      <UsageStatTable />
      <TagList />
    </div>
  );
};

export default Sidebar;
