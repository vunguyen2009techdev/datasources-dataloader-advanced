import LabelAPI from "./model";
import LabelSchema from "./schema";

export default (db) => {
  return new LabelAPI(db.model("Label", LabelSchema));
};
