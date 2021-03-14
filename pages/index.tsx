import Head from "next/head";
import Link from "next/link";
import Layout from "components/Layout";
import { useQuery, gql } from "@apollo/client";
import NewsFeedContainer from "components/NewsFeedContainer";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { NewsFeedRow } from "graphql/db";
import "react-tabs/style/react-tabs.css";

const FEED_QUERY = gql`
  query newsFeed($fellowship: String!, $cursor: String) {
    newsFeed(fellowship: $fellowship, cursor: $cursor) {
      cursor
      items {
        uId
        name
        fellowship
        avatar_url
        type
        created_ts
      }
    }
  }
`;

type QueryData = {
  newsFeed: {
    cursor: string;
    items: NewsFeedRow[];
  };
};

type QueryVars = {
  fellowship: string;
  cursor: string;
};

export default function Home() {
  const [newsFeed, setNewsFeed] = useState<NewsFeedRow[]>([]);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);
  const [selectedFellowship, setSelectedFellowship] = useState<string>(
    "founders"
  );
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  const handleFellowshipChange = (selectedIndex: number) => {
    setSelectedTabIndex(selectedIndex);
    switch (selectedIndex) {
      case 0:
        setSelectedFellowship("founders");
        break;
      case 1:
        setSelectedFellowship("angels");
        break;
      case 2:
        setSelectedFellowship("writers");
        break;
      default:
        break;
    }
  };

  const { data, error, loading, fetchMore } = useQuery<QueryData, QueryVars>(
    FEED_QUERY,
    {
      variables: {
        fellowship: selectedFellowship,
        cursor: "2099-01-01 00:00",
      },
    }
  );

  useEffect(() => {
    if (data?.newsFeed?.items?.length) {
      setNewsFeed(data?.newsFeed?.items);
      if (data?.newsFeed?.cursor == null) {
        setAllDataLoaded(true);
      } else {
        setAllDataLoaded(false);
      }
    }
  }, [data]);

  const handleLoadMore = async () => {
    await fetchMore({
      variables: {
        fellowship: selectedFellowship,
        cursor: data?.newsFeed?.cursor,
      },
    });
  };

  if (!newsFeed || loading || error) {
    return null;
  }
  return (
    <Layout>
      <Head>
        <title>On Deck Newsfeed</title>
      </Head>
      <h1>OnDeck Community Platform </h1>
      <p>
        Welcome to OnDeck Directory! Check the updates across fellowships below
      </p>
      <Tabs onSelect={handleFellowshipChange} selectedIndex={selectedTabIndex}>
        <TabList>
          <Tab>Founders</Tab>
          <Tab>Angels</Tab>
          <Tab>Writers</Tab>
        </TabList>

        <TabPanel>
          <InfiniteScroll
            loadMore={handleLoadMore}
            hasMore={!allDataLoaded}
            loader={<h4>Loading...</h4>}
          >
            <NewsFeedContainer newsFeed={newsFeed}></NewsFeedContainer>
          </InfiniteScroll>
        </TabPanel>
        <TabPanel>
          <InfiniteScroll
            loadMore={handleLoadMore}
            hasMore={!allDataLoaded}
            loader={<h4>Loading...</h4>}
          >
            <NewsFeedContainer newsFeed={newsFeed}></NewsFeedContainer>
          </InfiniteScroll>
        </TabPanel>
        <TabPanel>
          <InfiniteScroll
            loadMore={handleLoadMore}
            hasMore={!allDataLoaded}
            loader={<h4>Loading...</h4>}
          >
            <NewsFeedContainer newsFeed={newsFeed}></NewsFeedContainer>
          </InfiniteScroll>
        </TabPanel>
      </Tabs>
    </Layout>
  );
}

const FellowshipSelector = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  align-items: flex-start;
`;
