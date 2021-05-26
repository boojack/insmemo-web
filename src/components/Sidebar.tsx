import React, { useEffect } from "react";
import { UserBanner } from "./UserBanner";
import { TagList } from "./TagList";
import "../less/siderbar.less";

export const Sidebar: React.FunctionComponent = () => {
  useEffect(() => {
    // do nth
  }, []);

  return (
    <div className="sidebar-wrapper">
      <UserBanner />
      <TagList />
    </div>
  );
};
