import ProjectAPI from "./model";
import ProjectSchema from "./schema";

export default (db) => {
  return new ProjectAPI(db.model("Project", ProjectSchema));
};
