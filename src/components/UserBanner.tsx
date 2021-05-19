import React from "react";
import { api } from "../helpers/api";
import { memoService } from "../helpers/memoService";
import { userService } from "../helpers/userService";
import { historyService } from "../helpers/historyService";
import { showAboutSiteDialog } from "./AboutSiteDialog";
import { TagList } from "./TagList";
import "../less/user-banner.less";

interface Props {
  userinfo: Model.User;
}

interface State {
  createdDays: number;
  memosAmount: number;
  tags: Model.Tag[];
  showBtnsDialog: boolean;
}

export class UserBanner extends React.Component<Props> {
  public state: State;

  constructor(props: Props) {
    super(props);

    const { userinfo } = this.props;

    this.state = {
      createdDays: Math.ceil((Date.now() - new Date(userinfo.createdAt).getTime()) / 1000 / 3600 / 24),
      memosAmount: memoService.getMemos().length,
      tags: [],
      showBtnsDialog: false,
    };
  }

  public async componentDidMount() {
    const fetchTags = async () => {
      let { data: tags } = await api.getMyTags();
      tags = tags
        .map((t) => {
          return {
            ...t,
            createdAt: new Date(t.createdAt).getTime(),
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt);
      this.setState({
        tags,
      });
    };

    const fetchMemosCount = async () => {
      const { data } = await api.getMemosCount();
      this.setState({
        memosAmount: data,
      });
    };

    memoService.bindStateChange(this, async (memos) => {
      fetchTags();
      fetchMemosCount();
    });
  }

  public componentWillUnmount() {
    memoService.unbindStateListener(this);
  }

  public render() {
    const { userinfo } = this.props;
    const { memosAmount, createdDays, tags, showBtnsDialog } = this.state;

    return (
      <div className="user-banner-wrapper">
        <div className="user-banner-container">
          <div className="userinfo-header-container">
            <p className="username-text" onClick={this.handleUsernameClick}>
              {userinfo.username}
            </p>
            <button className="action-btn" onClick={this.toggleBtnsDialog}>
              ···
            </button>
            <div className={"action-btns-dialog " + (showBtnsDialog ? "" : "hidden")}>
              <button className="text-btn action-btn" onClick={this.handleAboutBtnClick}>
                <span className="icon">😀</span> 关于
              </button>
              <button className="text-btn action-btn" onClick={this.handleFeedbackBtnClick}>
                <span className="icon">🐛</span> 问题反馈
              </button>
              <button className="text-btn action-btn" onClick={this.handleSignoutBtnClick}>
                <span className="icon">👋</span> 退出
              </button>
            </div>
          </div>
          <div className="status-text-container">
            <div className="status-text memos-text">
              <span className="amount-text">{memosAmount}</span>
              <span className="type-text">MEMO</span>
            </div>
            <div className="status-text tags-text">
              <span className="amount-text">{tags.length}</span>
              <span className="type-text">TAG</span>
            </div>
            <div className="status-text duration-text">
              <span className="amount-text">{createdDays}</span>
              <span className="type-text">DAY</span>
            </div>
          </div>

          <TagList tags={tags}></TagList>
        </div>
      </div>
    );
  }

  protected toggleBtnsDialog = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    const nextState = !this.state.showBtnsDialog;

    if (nextState) {
      const bodyClickHandler = () => {
        this.setState({
          showBtnsDialog: false,
        });
        document.body.removeEventListener("click", bodyClickHandler);
      };

      document.body.addEventListener("click", bodyClickHandler);
    }

    this.setState({
      showBtnsDialog: nextState,
    });
  };

  protected handleUsernameClick = () => {
    historyService.setParamsState({ tag: "" });
  };

  protected handleSignoutBtnClick = async () => {
    await userService.doSignOut();
    location.reload();
  };

  protected handleFeedbackBtnClick = () => {
    window.open("https://github.com/boojack/insmemo/issues/new");
  };

  protected handleAboutBtnClick = () => {
    showAboutSiteDialog();
  };
}
