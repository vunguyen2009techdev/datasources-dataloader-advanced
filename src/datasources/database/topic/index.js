import TopicAPI from "./model";
import TopicSchema from "./schema";

export default (db) => {
  return new TopicAPI(db.model("Topic", TopicSchema));
};
