import React, { useCallback, useEffect, useRef, useState } from "react";
import { memoStore } from "../stores";
import { locationService, memoService, userService } from "../services";
import { DAILY_TIMESTAMP } from "../helpers/consts";
import useSelector from "../hooks/useSelector";
import { utils } from "../helpers/utils";
import toast from "./Toast";
import "../less/usage-stat-table.less";

const tableConfig = {
  width: 12,
  height: 7,
};

interface UsageStatDaily {
  timestamp: number;
  count: number;
}

interface Props {}

const UsageStatTable: React.FC<Props> = () => {
  const todayTimeStamp = utils.getTimeStampByDate(Date.now());
  const todayDay = new Date(todayTimeStamp).getDay() || 7;
  const usedDaysAmount = (tableConfig.width - 1) * tableConfig.height + todayDay;
  const beginDayTimestemp = todayTimeStamp - usedDaysAmount * DAILY_TIMESTAMP;
  const nullCell = new Array(7 - todayDay).fill(0);

  const getInitialUsageStat = (): UsageStatDaily[] => {
    const initialUsageStat: UsageStatDaily[] = [];
    for (let i = 1; i <= usedDaysAmount; i++) {
      initialUsageStat.push({
        timestamp: beginDayTimestemp + DAILY_TIMESTAMP * i,
        count: 0,
      });
    }
    return initialUsageStat;
  };

  const { memos } = useSelector(memoStore);
  const [allStat, setAllStat] = useState<UsageStatDaily[]>(getInitialUsageStat());
  const [popupStat, setPopupStat] = useState<UsageStatDaily | null>(null);
  const [currentStat, setCurrentStat] = useState<UsageStatDaily | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { user } = userService.getState();

      if (user) {
        try {
          const newStat: UsageStatDaily[] = getInitialUsageStat();
          const data = await memoService.getMemosStat();

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

    fetchData();
  }, [memos]);

  const handleUsageStatItemMouseEnter = useCallback((ev: React.MouseEvent, item: UsageStatDaily) => {
    setPopupStat(item);

    if (popupRef.current) {
      const targetEl = ev.target as HTMLElement;
      popupRef.current.style.left = targetEl.offsetLeft + "px";
      popupRef.current.style.top = targetEl.offsetTop + "px";
    }
  }, []);

  const handleUsageStatItemMouseLeave = useCallback((ev: React.MouseEvent, item: UsageStatDaily) => {
    setPopupStat(null);
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
      <div ref={popupRef} className={"usage-detail-container pop-up " + (popupStat ? "" : "hidden")}>
        {popupStat?.count} memos on <span className="date-text">{new Date(popupStat?.timestamp!).toDateString()}</span>
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

export default UsageStatTable;
