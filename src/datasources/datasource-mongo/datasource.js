import { DataSource } from "apollo-datasource";
import { ApolloError } from "apollo-server";
import { InMemoryLRUCache } from "apollo-server-caching";
import { isCollectionOrModel } from "./helpers";
import { createCachingMethods } from "./cache";

class MongoDataSource extends DataSource {
  constructor(collection) {
    super();

    if (!isCollectionOrModel) {
      throw new ApolloError(
        `MongoDataSource constructor must be given an object with a single collection`
      );
    }

    this.collection = collection;
  }

  initialize({ context, cache, debug } = {}) {
    this.context = context;

    const cached = cache || new InMemoryLRUCache();
    const methods = createCachingMethods({
      collection: this.collection,
      cache: cached,
      debug,
    });

    Object.assign(this, methods);
  }
}

export { MongoDataSource };
