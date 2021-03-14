import {ApolloServer, gql} from 'apollo-server-micro'
import * as resolvers from './resolvers'

const typeDefs = gql`
  type Project {
    id: Int!
    name: String!
    description: String!
    icon_url: String!
    users: [User!]!
  }

  type User {
    id: Int!
    name: String!
    bio: String!
    avatar_url: String!
    fellowship: String!
    projects: [Project!]!
  }

  type Query {
    project(id: Int!): Project!
    user(id: Int!): User!
    newsFeed(fellowship: String!, cursor: String): NewsFeedResult!
  }

  type NewsFeedResult {
    cursor: String,
    items: [NewsFeedItem!]
  }

  type NewsFeedItem {
    uId: Int!
    created_ts: String!
    name: String!
    fellowship: String!
    avatar_url: String
    type: String!
  }
`;

export const server = new ApolloServer({typeDefs, resolvers})
