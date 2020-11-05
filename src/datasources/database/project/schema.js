import { Schema } from "mongoose";

const ProjectSchema = new Schema({
  name: String,
  description: String,
  labelIds: [String],
});

export default ProjectSchema;
