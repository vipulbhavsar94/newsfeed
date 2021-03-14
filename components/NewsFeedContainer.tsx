import NewsFeedItem from "./NewsFeedItem";
import { NewsFeedRow } from "graphql/db";

type Props = {
  newsFeed: NewsFeedRow[];
};

export default function NewsfeedContainer(props: Props) {
  return (
    <>
      {props.newsFeed.map((x) => {
        return (
          <NewsFeedItem key={x.uId + Math.random()} news={x}></NewsFeedItem>
        );
      })}
    </>
  );
}
