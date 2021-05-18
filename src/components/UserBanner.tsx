import React from "react";
import { api } from "../helpers/api";
import { memoService } from "../helpers/memoService";
import { userService } from "../helpers/userService";
import { toast } from "./Toast";
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
        <div className="userinfo-container">
          <div className="userinfo-header-container">
            <p className="username-text">{userinfo.username}</p>
            <span className="action-btn" onClick={this.toggleBtnsDialog}>
              ···
            </span>
            <div className={"action-btns-dialog " + (showBtnsDialog ? "" : "hidden")}>
              <p className="text-btn action-btn" onClick={this.handleAboutBtnClick}>
                <span className="icon">😀</span> 关于 insmemo
              </p>
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
          <div className="tags-container">
            <p className="title-text">常用标签</p>
            {tags.map((t, index) => (
              <div
                key={t.id}
                className="tag-item-container"
                onClick={() => {
                  this.handleTagDelete(index, t.id);
                }}
              >
                <span># {t.text}</span>
              </div>
            ))}
          </div>
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

  protected handleSignoutBtnClick = async () => {
    await userService.doSignOut();
  };

  protected handleAboutBtnClick = async () => {
    toast.info("Hello world~");
  };

  protected async handleTagDelete(index: number, tagId: string) {
    // toast.info("应该删除这个标签？");
    // await api.deleteTagById(tagId);
    // const { tags } = this.state;
    // tags.splice(index, 1);
    // this.setState({
    //   tags,
    // });
  }
}
