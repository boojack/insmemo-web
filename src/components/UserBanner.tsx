import React from "react";
import { api } from "../helpers/api";
import { memoService } from "../helpers/memoService";
import "../less/user-banner.less";

interface Props {
  userinfo: Model.User;
}

interface State {
  createdDays: number;
  memosAmount: number;
  tags: Model.Tag[];
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
    };
  }

  public async componentDidMount() {
    const tags = await api.getMyTags();
    this.setState({
      tags,
    });

    memoService.bindStateChange(this, (memos) => {
      this.setState({
        memosAmount: memos.length,
      });
    });
  }

  public componentWillUnmount() {
    memoService.unbindStateListener(this);
  }

  public render() {
    const { userinfo } = this.props;
    const { memosAmount, createdDays, tags } = this.state;

    return (
      <div className="user-banner-wrapper">
        <div className="userinfo-container">
          <p className="username-text">{userinfo.username}</p>
          <div className="status-text-container">
            <p className="status-text memos-text">
              memo: <span className="amount-text">{memosAmount}</span>
            </p>
            <p className="status-text duration-text">
              day: <span className="amount-text">{createdDays}</span>
            </p>
          </div>
          <div className="tags-container">
            <p className="container-text">tags:</p>
            {tags.map((t, index) => (
              <div
                key={t.id}
                className="tag-item-container"
                onClick={() => {
                  this.handleTagDelete(index, t.id);
                }}
              >
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  protected async handleTagDelete(index: number, tagId: string) {
    await api.deleteTagById(tagId);

    const { tags } = this.state;
    tags.splice(index, 1);
    this.setState({
      tags,
    });
  }
}
