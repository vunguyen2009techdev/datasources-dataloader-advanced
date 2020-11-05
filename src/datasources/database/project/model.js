import { MongoDataSource } from "../../datasource-mongo";
import { removeEmpty } from "./../../../utils";

export default class Project extends MongoDataSource {
  initialize(config) {
    super.initialize({ ...config, debug: true });
  }

  async getProjects(condition, orderBy) {
    return await this.collection.find(condition, null, { sort: orderBy });
  }

  async loadOneById(id, { ttl = null } = {}) {
    return await this.findOneById(id, { ttl });
  }

  async update({ ...obj }) {
    const objUpdate = removeEmpty(obj);
    if (!objUpdate) return null;

    await this.collection.updateOne({ _id: obj.id }, obj);
    await this.deleteFromCachebyId(obj.id);
    return await this.findOneById(obj.id, { ttl: 120 });
  }
}
