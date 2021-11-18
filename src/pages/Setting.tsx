import { useCallback, useContext, useEffect } from "react";
import appContext from "../stores/appContext";
import { memoService } from "../services";
import MyAccountSection from "../components/MyAccountSection";
import PreferencesSection from "../components/PreferencesSection";
import { MOBILE_ADDITION_CLASSNAME, PAGE_CONTAINER_SELECTOR } from "../helpers/consts";
import Only from "../components/common/OnlyWhen";
import "../less/setting.less";

interface Props {}

const Setting: React.FC<Props> = () => {
  const {
    globalState: { isMobileView },
  } = useContext(appContext);

  useEffect(() => {
    memoService.fetchAllMemos();
  }, []);

  const handleMoreActionBtnClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    const pageContainerEl = document.querySelector(PAGE_CONTAINER_SELECTOR);

    if (pageContainerEl) {
      pageContainerEl.classList.add(MOBILE_ADDITION_CLASSNAME);
    }
  }, []);

  return (
    <div className="preference-wrapper">
      <div className="section-header-container">
        <div className="title-text">
          <Only when={isMobileView}>
            <button className="action-btn" onClick={handleMoreActionBtnClick}>
              <img className="icon-img" src="/icons/menu.svg" alt="menu" />
            </button>
          </Only>
          <span className="normal-text">账号与设置</span>
        </div>
      </div>

      <div className="sections-wrapper">
        <MyAccountSection />
        <PreferencesSection />
      </div>
    </div>
  );
};

export default Setting;
