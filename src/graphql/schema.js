import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    _: Boolean,
    project(id: String): Project
    projects(where: ProjectWhereInput, orderBy: ProjectOrderByInput): [Project]!
    projectsConnection(where: ProjectWhereInput, orderBy: ProjectOrderByInput, limit: Int, skip: Int): ProjectConnection
    projectByIds(ids: [String]): [Project]
    projectByQuery(query: String): [Project]
  }

  type Mutation {
    updateProject(id: String, name: String, description: String): Project
  }

  type Project {
    _id: ID
    name: String
    description: String
    topics: [Topic]
    labels: [Label]
  }

  type Topic {
    _id: ID
    name: String
    query: String
    projects: [Project]
  }

  type Label {
    _id: ID
    name: String
    description: String
    projects: [Project]
  }

  type ProjectConnection {
    projects: [Project]
    pageInfo: PageInfo
  }

  type PageInfo {
    limit: Int,
    totalDocs: Int,
    totalPage: Int,
    currentPage: Int,
    hasNextPage: Boolean,
    hasPreviousPage: Boolean,
  }

  input QueryStringInput {
    eq: String
    ne: String
    in: [String]
    nin: [String]
    isStr: String
  }

  input ProjectWhereInput {
    name: QueryStringInput
    description: QueryStringInput
    and: [ProjectWhereInput]
    not: [ProjectWhereInput]
    nor: [ProjectWhereInput]
    or: [ProjectWhereInput]
  }

  input ProjectOrderByInput {
    name: SortInput
    description: SortInput
  }

  enum SortInput {
    ASC
    DESC
  }
`;