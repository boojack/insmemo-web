import React, { useEffect, useState } from "react";
import { api } from "../helpers/api";
import memoService from "../helpers/memoService";
import userService from "../helpers/userService";
import { utils } from "../helpers/utils";
import "../less/usage-stat-table.less";

const table = {
  width: 12,
  height: 7,
};

const UsageStatTable = () => {
  const todayTimestamp = utils.getTimeStampByDate(Date.now());
  const todayDate = new Date(todayTimestamp).getDay();
  const [stat, setStat] = useState<number[]>(new Array((table.width - 1) * table.height + todayDate).fill(0));
  const nullCell = new Array(7 - todayDate).fill(0);

  useEffect(() => {
    const fetchData = async () => {
      const { user } = userService.getState();

      if (user) {
        const { data } = await api.getMemosStat();
        const newStat = [...stat];
        const beginDayTimestemp = todayTimestamp - (77 + todayDate) * 1000 * 3600 * 24;

        for (const d of data) {
          const index = (utils.getTimeStampByDate(d.timestamp) - beginDayTimestemp) / (1000 * 3600 * 24) - 1;
          if (index >= 0) {
            newStat[index] = d.amount;
          }
        }

        setStat([...newStat]);
      }
    };

    const unsubscribeMemoStore = memoService.subscribe(() => {
      fetchData();
    });

    return () => {
      unsubscribeMemoStore();
    };
  }, []);

  return (
    <div className="usage-stat-table-wrapper">
      <div className="day-tip-text-container">
        <span className="tip-text">Mon</span>
        <span className="tip-text"></span>
        <span className="tip-text">Wed</span>
        <span className="tip-text"></span>
        <span className="tip-text">Fri</span>
        <span className="tip-text"></span>
        <span className="tip-text">Sun</span>
      </div>
      <div className="usage-stat-table">
        {stat.map((v, i) => {
          const color = v <= 0 ? "" : v <= 2 ? "stat-day-L1-bg" : v <= 4 ? "stat-day-L2-bg" : v <= 8 ? "stat-day-L3-bg" : "stat-day-L4-bg";
          return <span className={"stat-container " + color} key={i}></span>;
        })}
        {nullCell.map((v, i) => (
          <span className="stat-container null" key={i}></span>
        ))}
      </div>
    </div>
  );
};

export default UsageStatTable;
