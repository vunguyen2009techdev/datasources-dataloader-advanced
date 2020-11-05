import DataLoader from "dataloader";
import sift from "sift";
import { getCollection } from "./helpers";

const orderDocs = (ids) => (docs) => {
  const idMap = {};
  docs.map((doc) => {
    idMap[doc._id] = doc;
  });
  return ids.map((id) => idMap[id]);
};

const handleCache = async ({ ttl, doc, key, cache }) => {
  if (Number.isInteger(ttl)) {
    cache.set(key, JSON.stringify(doc), { ttl });
  }
};

export const createCachingMethods = ({
  collection,
  cache,
  allowFlushingCollectionCache = false,
  debug = false,
}) => {
  const isRedis = typeof cache.store === "undefined";
  const isMongoose = typeof collection === "function";

  const loader = new DataLoader((ids) => {
    const filter = {
      _id: { $in: ids },
    };

    return isMongoose
      ? collection.find(filter).lean().then(orderDocs(ids))
      : collection.find(filter).then(orderDocs(ids));
  });

  const dataQuery = ({ queries }) => {
    const filter = queries.map((objQuery) => {
      const { query } = objQuery;
      return query;
    });

    return collection
      .find({ $or: filter })
      .lean()
      .then((data) => {
        return filter.map((query) => data.filter(sift(query)));
      });
  };

  const queryLoader = new DataLoader((queries) => dataQuery({ queries }));

  const dataQueryWithoption = ({ queries }) => {
    console.log("queries: ", queries);
    const filter = queries.map((objQuery) => {
      const { query } = objQuery;
      return query;
    });

    const select = (queries && queries[0] && queries[0].select) || null;
    const option = (queries && queries[0] && queries[0].option) || null;

    return collection
      .find({ $or: filter }, select, option)
      .lean()
      .then((data) => {
        console.log("is data: ", data);
        const results = queries.map((objQuery) => {
          const { query } = objQuery;
          console.log("is query: ", query);
          const filter = data.filter(sift(query));
          return filter;
        });
        return results;
      });
  };

  const queryWithOptionLoader = new DataLoader((queries) =>
    dataQueryWithoption({ queries })
  );

  const cachePrefix = `mongo:${getCollection(collection).collectionName}:`;

  const methods = {
    findOneById: async (id = null, { ttl = null }) => {
      const key = `${cachePrefix}${id}`;
      const cacheDoc = await cache.get(key);

      if (debug) {
        console.log("KEY", key, cacheDoc ? "cache" : "miss");
      }

      if (cacheDoc) {
        return JSON.parse(cacheDoc);
      }

      const doc = await loader.load(id);

      await handleCache({
        ttl,
        doc,
        key,
        cache,
      });

      return doc;
    },
    findManyByIds: async (ids, { ttl } = {}) => {
      return await Promise.all(
        ids.map((id) => methods.findOneById(id, { ttl }))
      );
    },
    findManyByQuery: async ({ query }, { ttl } = {}) => {
      const key = cachePrefix + JSON.stringify(query);
      const cacheDocs = await cache.get(key);

      if (debug) {
        console.log("KEY", key, cacheDocs ? "cache" : "miss");
      }

      if (cacheDocs) {
        return JSON.parse(cacheDocs);
      }

      const docs = await queryLoader.load({ query });

      await handleCache({
        ttl,
        doc: docs,
        key,
        cache,
      });
      return docs;
    },
    findManyByQueryAndOption: async (
      { query, select, option },
      { ttl } = {}
    ) => {
      const key = cachePrefix + JSON.stringify({ query, select, option });
      console.log("key: ", key);

      const cacheDocs = await cache.get(key);

      if (debug) {
        console.log("KEY", key, cacheDocs ? "cache" : "miss");
      }

      if (cacheDocs) {
        return JSON.parse(cacheDocs);
      }

      const docs = await queryWithOptionLoader.load({ query, select, option });
      await handleCache({
        ttl,
        doc: docs,
        key,
        cache,
      });
      return docs;
    },
    deleteFromCachebyId: async (id) => {
      const key = id && typeof id === "object" ? JSON.stringify(id) : id;
      await cache.delete(`${cachePrefix}${key}`);
    },
  };
  return methods;
};
