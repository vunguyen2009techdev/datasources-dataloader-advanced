require("dotenv").config();
import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { redisCluster } from "./redis";
import { schema } from "./graphql";
import createDataSource from "./datasources";

const { RedisClusterCache } = require("apollo-server-cache-redis");

const {
  MONGO_HOST: mongoHost,
  MONGO_PORT: mongoPort,
  MONGO_DB_NAME: mongoDBName,
} = process.env;

(async () => {
  mongoose.set("debug", true);

  const db = await mongoose.connect(
    `mongodb://${mongoHost}:${mongoPort}/${mongoDBName}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const server = new ApolloServer({
    schema,
    tracing: true,
    dataSources: () => ({
      ...createDataSource(db),
    }),
    cache: new RedisClusterCache(redisCluster),
  });

  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
})();
