import { MongoDataSource } from "../../datasource-mongo";

export default class Topic extends MongoDataSource {
  initialize(config) {
    super.initialize({ ...config, debug: true });
  }
}
