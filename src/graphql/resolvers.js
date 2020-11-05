import { proccessQueryCondition } from "./../utils";

export const resolvers = {
  Query: {
    project: async (_, { id }, { dataSources: { Project } }) => {
      return await Project.loadOneById(id, { ttl: 120 });
    },

    projects: async (_, { where, orderBy }, { dataSources: { Project } }) => {
      const condition = proccessQueryCondition(where);
      return await Project.getProjects(condition, orderBy);
    },

    projectByIds: async (_, { ids }, { dataSources: { Project } }) => {
      return await Project.findManyByIds(ids, { ttl: 120 });
    },

    projectByQuery: async (_, { query }, { dataSources: { Project } }) => {
      const filter = { name: { $regex: query, $options: "i" } };
      return await Project.findManyByQuery({ query: filter }, { ttl: 120 });
    },

    projectsConnection: async (
      _,
      { orderBy, where, limit = 10, skip = 0 },
      { dataSources: { Project } }
    ) => {
      const sort = orderBy;
      const condition = proccessQueryCondition(where);

      const [projects, countDocument] = await Promise.all([
        Project.findManyByQueryAndOption(
          { query: condition, select: null, option: { sort, limit, skip } },
          { ttl: 120 }
        ),
        Project.collection.countDocuments(condition),
      ]);

      const totalPage = limit > 0 ? Math.ceil(countDocument / limit) || 1 : 0;
      const currentPage = Math.ceil((skip + 1) / limit);

      const pageInfo = {
        limit,
        totalDocs: countDocument,
        totalPage,
        currentPage,
        hasNextPage: currentPage < totalPage,
        hasPreviousPage: currentPage > 1,
      };

      return {
        projects,
        pageInfo,
      };
    },
  },
  Mutation: {
    updateProject: async (
      _,
      { id, name, description },
      { dataSources: { Project } }
    ) => {
      return await Project.update({ id, name, description });
    },
  },
  Project: {
    topics: async (root, __, { dataSources: { Topic } }) => {
      return await Topic.findManyByQuery(
        { query: { projectIds: root._id } },
        { ttl: 120 }
      );
    },
    labels: async (root, __, { dataSources: { Label } }) => {
      return await Label.findManyByIds(root.labelIds, { ttl: 120 });
    },
  },
  Topic: {
    projects: async (root, __, { dataSources: { Project } }) => {
      return await Project.findManyByIds(root.projectIds, { ttl: 120 });
    },
  },
  Label: {
    projects: async (root, __, { dataSources: { Project } }) => {
      return await Project.findManyByQuery(
        { query: { labelIds: root._id } },
        { ttl: 120 }
      );
    },
  },
};
