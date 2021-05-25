import React, { useEffect, useState } from "react";
import { userService } from "../helpers/userService";
import { UserBanner } from "./UserBanner";
import { TagList } from "./TagList";
import "../less/siderbar.less";

export const Sidebar: React.FunctionComponent = () => {
  const [userinfo, setUserinfo] = useState<Model.User>(userService.getUserInfo() as Model.User);

  useEffect(() => {
    const ctx = {
      key: Date.now(),
    };

    userService.bindStateChange(ctx, (userinfo) => {
      if (userinfo) {
        setUserinfo(userinfo);
      }
    });

    return () => {
      userService.unbindStateListener(ctx);
    };
  }, []);

  return (
    <div className="sidebar-wrapper">
      {userinfo ? (
        <>
          <UserBanner userinfo={userinfo} />
          <TagList />
        </>
      ) : (
        <div className="slogan-container">
          <p className="logo-text">insmemo</p>
        </div>
      )}
    </div>
  );
};
