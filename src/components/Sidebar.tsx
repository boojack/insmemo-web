import React, { useEffect, useState } from "react";
import { userService } from "../helpers/userService";
import { UserBanner } from "./UserBanner";
import { TagList } from "./TagList";
import "../less/siderbar.less";

export function Sidebar() {
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
          {/* <p className="slogan-text">📑 随时随手记一记</p>
          <p className="slogan-text">😋 更好的交互逻辑</p>
          <p className="slogan-text">
            💬 来吧~
            <button className="text-btn action-btn" onClick={this.handleShowSigninDialog}>
              注册/登录
            </button>
          </p> */}
        </div>
      )}
    </div>
  );
}
