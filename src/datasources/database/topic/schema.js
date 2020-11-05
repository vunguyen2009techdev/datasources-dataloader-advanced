import { Schema } from "mongoose";

const TopicSchema = new Schema({
  name: String,
  query: String,
  projectIds: [String]
});

export default TopicSchema;
