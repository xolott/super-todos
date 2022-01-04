import { Mongo } from "meteor/mongo";

const Projects = new Mongo.Collection("projects");
if (Meteor.isServer) {
  Projects.createIndex({ name: 1 }, { name: "unique_name", unique: true });
}
export default Projects;
