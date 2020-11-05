require("dotenv").config();

const {
  REDIS_CLUSTER_DEFAULT_HOST_ONE: redisClusterHostOne,
  REDIS_CLUSTER_DEFAULT_PORT_ONE: redisClusterPortOne,
} = process.env;

export const redisCluster =
  redisClusterPortOne &&
  redisClusterPortOne.split(",").map((port) => {
    return {
      host: redisClusterHostOne,
      port,
    };
  });
