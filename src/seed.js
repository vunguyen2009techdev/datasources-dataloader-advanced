require("dotenv").config();
import mongoose from "mongoose";
import createDataSource from "./datasources";

const {
  MONGO_HOST: mongoHost,
  MONGO_PORT: mongoPort,
  MONGO_DB_NAME: mongoDBName,
} = process.env;

(async () => {
  const data = {
    projects: [
      { name: "kfc", description: "kfc", pid: 1 },
      {
        name: "the coffee house",
        description: "The coffee house is a shop which sell cofee in VietNam",
        pid: 2,
      },
      {
        name: "honda",
        description: "honda is selling motobike and car",
        pid: 3,
      },
      {
        name: "vinamilk",
        description:
          "vinamilk is the biggest company which is selling milk in VietNam",
        pid: 4,
      },
      { name: "facebook", description: "facebook is social chat...", pid: 5 },
      {
        name: "cocacola",
        description: "cocacola is the name of the coke in USA",
        pid: 6,
      },
    ],
    topics: [
      {
        name: "vietcombank topic",
        query: "ngan hang vietcombank",
        pid: [1, 2, 3],
      },
      { name: "bidv topic", query: "ngan hang bidv", pid: [4, 5, 6] },
      { name: "sacombank topic", query: "ngan hang sacombank", pid: [3, 2] },
      { name: "vinamilk topic", query: "cty vinamilk", pid: [4] },
      { name: "facebook topic", query: "cty facebook", pid: [5] },
    ],
    labels: [
      { name: "Dich Vu", description: "Dich Vu" },
      { name: "Dich Vu 2", description: "Dich Vu 2" },
      { name: "Dich Vu 3", description: "Dich Vu 3" },
      { name: "Dich Vu 4", description: "Dich Vu 4" },
      { name: "Dich Vu 5", description: "Dich Vu 5" },
    ],
  };

  const db = await mongoose.connect(
    `mongodb://${mongoHost}:${mongoPort}/${mongoDBName}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const builtSource = { ...createDataSource(db) };

  let dataProjects = data.projects.map((p) => ({
    name: p.name,
    description: p.description,
  }));
  let projects = await builtSource.Project.collection.insertMany(dataProjects);

  projects = projects.map((project) => {
    const { _doc } = project;
    const findProject = data.projects.find((f) => f.name == project.name);
    return {
      ..._doc,
      pid: findProject.pid,
    };
  });

  console.log("============projects=========");
  console.log(projects);

  const dataTopics = data.topics.map((t) => {
    const projectIds = projects
      .filter((project) => t.pid.includes(project.pid))
      .map((i) => i._id);
    return {
      name: t.name,
      query: t.query,
      projectIds,
    };
  });

  console.log("==========topics============");
  console.log(dataTopics);

  const topics = await builtSource.Topic.collection.insertMany(dataTopics);
  const labels = await builtSource.Label.collection.insertMany(data.labels);
  const labelIds = labels.map((l) => {
    return l._doc._id;
  });

  await builtSource.Project.collection.updateMany({}, { labelIds });
})();
