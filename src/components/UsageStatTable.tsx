import React, { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../helpers/api";
import { DAILY_TIMESTAMP } from "../helpers/consts";
import toast from "./Toast";
import memoService from "../helpers/memoService";
import userService from "../helpers/userService";
import locationService from "../helpers/locationService";
import { utils } from "../helpers/utils";
import "../less/usage-stat-table.less";

const tableConfig = {
  width: 12,
  height: 7,
};

interface UsageStatDaily {
  timestamp: number;
  count: number;
}

const todayTimestamp = utils.getTimeStampByDate(Date.now());
const todayDay = new Date(todayTimestamp).getDay() || 7;
const usedDaysAmount = (tableConfig.width - 1) * tableConfig.height + todayDay;
const beginDayTimestemp = todayTimestamp - usedDaysAmount * DAILY_TIMESTAMP;

const UsageStatTable: React.FunctionComponent = () => {
  const nullCell = new Array(7 - todayDay).fill(0);
  const [allStat, setAllStat] = useState<UsageStatDaily[]>(new Array(usedDaysAmount));
  const [todayStat, setTodayStat] = useState<UsageStatDaily | null>(null);
  const [currentStat, setCurrentStat] = useState<UsageStatDaily | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const payloadStat: UsageStatDaily[] = [];

    for (let i = 1; i <= usedDaysAmount; i++) {
      payloadStat.push({
        timestamp: beginDayTimestemp + DAILY_TIMESTAMP * i,
        count: 0,
      });
    }
    setAllStat([...payloadStat]);

    const fetchData = async () => {
      const { user } = userService.getState();

      if (user) {
        try {
          // 简单实现深拷贝
          const newStat: UsageStatDaily[] = JSON.parse(JSON.stringify(payloadStat));
          const data = await getMemosStat();

          for (const d of data) {
            const index = (utils.getTimeStampByDate(d.timestamp) - beginDayTimestemp) / (1000 * 3600 * 24) - 1;
            if (index >= 0) {
              newStat[index].count = d.amount;
            }
          }

          setAllStat([...newStat]);
        } catch (error) {
          toast.error(error);
        }
      }
    };

    const unsubscribeMemoService = memoService.subscribe(() => {
      fetchData();
    });

    return () => {
      unsubscribeMemoService();
    };
  }, []);

  const handleUsageStatItemMouseEnter = useCallback((ev: React.MouseEvent, item: UsageStatDaily) => {
    setTodayStat(item);

    if (popupRef.current) {
      const targetEl = ev.target as HTMLElement;
      popupRef.current.style.left = targetEl.offsetLeft + "px";
      popupRef.current.style.top = targetEl.offsetTop + "px";
    }
  }, []);

  const handleUsageStatItemMouseLeave = useCallback((ev: React.MouseEvent, item: UsageStatDaily) => {
    setTodayStat(null);
  }, []);

  const handleUsageStatItemClick = (item: UsageStatDaily) => {
    if (currentStat?.timestamp === item.timestamp) {
      locationService.setFromAndToQuery(0, 0);
      setCurrentStat(null);
    } else if (item.count > 0) {
      locationService.setFromAndToQuery(item.timestamp, item.timestamp + DAILY_TIMESTAMP);
      setCurrentStat(item);
    }
  };

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

      {/* popup */}
      <div ref={popupRef} className={"usage-detail-container pop-up " + (todayStat ? "" : "hidden")}>
        {todayStat?.count} memos on <span className="date-text">{new Date(todayStat?.timestamp!).toDateString()}</span>
      </div>

      <div className="usage-stat-table">
        {allStat.map((v, i) => {
          const count = v.count;
          const colorLevel =
            count <= 0
              ? ""
              : count <= 2
              ? "stat-day-L1-bg"
              : count <= 4
              ? "stat-day-L2-bg"
              : count <= 8
              ? "stat-day-L3-bg"
              : "stat-day-L4-bg";

          return (
            <span
              className={"stat-container " + colorLevel + (currentStat === v ? " current" : " ")}
              key={i}
              onMouseEnter={(e) => handleUsageStatItemMouseEnter(e, v)}
              onMouseLeave={(e) => handleUsageStatItemMouseLeave(e, v)}
              onClick={() => handleUsageStatItemClick(v)}
            ></span>
          );
        })}
        {nullCell.map((v, i) => (
          <span className="stat-container null" key={i}></span>
        ))}
      </div>
    </div>
  );
};

function getMemosStat(): Promise<Api.MemosStat[]> {
  return new Promise((resolve, reject) => {
    api
      .getMemosStat()
      .then(({ data }) => {
        resolve(data);
      })
      .catch(() => {
        reject("数据请求失败");
      });
  });
}

export default UsageStatTable;
