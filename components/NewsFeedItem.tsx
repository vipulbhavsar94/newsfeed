import styled from "styled-components";
import { NewsFeedRow } from "graphql/db";
import Link from "next/link";

type Props = {
  news: NewsFeedRow;
};

const fallbackImgUrl = "images/announcement-icon.jpg";

const getFeedInfo = (news: NewsFeedRow) => {
  switch (news.type) {
    case "users":
      return (
        <Link href={`/users/${news.uId}`}>
          <span style={{ cursor: "pointer" }}>
            New User:
            {" " + news.name} <br />
            Fellowship: {news.fellowship} <br />
            Joined: {news.created_ts}
          </span>
        </Link>
      );
      break;
    case "announcements":
      return (
        <>
          Announcement:
          {" " + news.name} <br />
          Fellowship: {news.fellowship} <br />
          Announced on: {news.created_ts}
        </>
      );
      break;
    case "projects":
      return (
        <Link href={`/projects/${news.uId}`}>
          <span style={{ cursor: "pointer" }}>
            New Project:
            {" " + news.name} <br />
            Fellowship: {news.fellowship} <br />
            Published: {news.created_ts}
          </span>
        </Link>
      );
      break;
    default:
      break;
  }
};

export default function NewsfeedContainer({ news }: Props) {
  return (
    <>
      <FeedItemContainer>
        <Avatar src={news.avatar_url || fallbackImgUrl} />
        <FeedInfo>{getFeedInfo(news)}</FeedInfo>
      </FeedItemContainer>
    </>
  );
}

const FeedInfo = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 1rem;
`;

const FeedItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #eaeaea;
  border-radius: 10px;
`;

const Avatar = styled.img`
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.1);
  width: 10%;
`;
