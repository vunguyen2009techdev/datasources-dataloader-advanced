import Project from "./project";
import Topic from "./topic";
import Label from "./label";

export default (db) => {
  return {
    Project: Project(db),
    Topic: Topic(db),
    Label: Label(db),
  };
};
