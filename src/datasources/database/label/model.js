import { MongoDataSource } from "../../datasource-mongo";

export default class Label extends MongoDataSource {
  initialize(config) {
    super.initialize({ ...config, debug: true });
  }
}
