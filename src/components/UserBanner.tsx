import React from "react";
import { api } from "../helpers/api";
import { memoService } from "../helpers/memoService";
import { historyService } from "../helpers/historyService";
import { ToolsBtnPopup } from "./ToolsBtnPopup";
import "../less/user-banner.less";

interface Props {
  userinfo: Model.User;
}

interface State {
  createdDays: number;
  memosAmount: number;
  tagsAmount: number;
  showToolsBtnDialog: boolean;
}

export class UserBanner extends React.Component<Props> {
  public state: State;

  constructor(props: Props) {
    super(props);
    const { userinfo } = props;

    this.state = {
      createdDays: Math.ceil((Date.now() - new Date(userinfo.createdAt).getTime()) / 1000 / 3600 / 24),
      memosAmount: 0,
      tagsAmount: 0,
      showToolsBtnDialog: false,
    };
  }

  public async componentDidMount() {
    const fetchTagsAmount = async () => {
      const { data: tags } = await api.getMyTags();
      this.setState({
        tagsAmount: tags.length,
      });
    };

    const fetchMemosAmount = async () => {
      const { data } = await api.getMemosCount();
      this.setState({
        memosAmount: data,
      });
    };

    memoService.bindStateChange(this, () => {
      fetchTagsAmount();
      fetchMemosAmount();
    });
  }

  public componentWillUnmount() {
    memoService.unbindStateListener(this);
  }

  public render() {
    const { userinfo } = this.props;
    const { memosAmount, createdDays, tagsAmount, showToolsBtnDialog } = this.state;

    return (
      <div className="user-banner-container">
        <div className="userinfo-header-container">
          <p className="username-text" onClick={this.handleUsernameClick}>
            {userinfo.username}
          </p>
          <button className="action-btn more-action-btn" onClick={this.handleMoreActionBtnClick}>
            ##
          </button>
          <button className="action-btn tools-dialog-btn" onClick={this.toggleBtnsDialog}>
            ···
          </button>
          <ToolsBtnPopup visibility={showToolsBtnDialog} />
        </div>
        <div className="status-text-container">
          <div className="status-text memos-text">
            <span className="amount-text">{memosAmount}</span>
            <span className="type-text">MEMO</span>
          </div>
          <div className="status-text tags-text">
            <span className="amount-text">{tagsAmount}</span>
            <span className="type-text">TAG</span>
          </div>
          <div className="status-text duration-text">
            <span className="amount-text">{createdDays}</span>
            <span className="type-text">DAY</span>
          </div>
        </div>
      </div>
    );
  }

  protected toggleBtnsDialog = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    const nextState = !this.state.showToolsBtnDialog;

    if (nextState) {
      const bodyClickHandler = () => {
        this.setState({
          showToolsBtnDialog: false,
        });
        document.body.removeEventListener("click", bodyClickHandler);
      };

      document.body.addEventListener("click", bodyClickHandler);
    }

    this.setState({
      showToolsBtnDialog: nextState,
    });
  };

  protected handleUsernameClick = () => {
    historyService.setParamsState({ tag: "" });
  };

  protected handleMoreActionBtnClick = () => {
    const pageContainerEl = document.querySelector("div#page-container");

    if (pageContainerEl?.classList.contains("show-user-banner-dialog")) {
      pageContainerEl?.classList.remove("show-user-banner-dialog");
    } else {
      pageContainerEl?.classList.add("show-user-banner-dialog");
    }
  };
}
