import { Mongo } from "meteor/mongo";

const Organizations = new Mongo.Collection("organizations");
if (Meteor.isServer) {
  Organizations.createIndex({ name: 1 }, { name: "unique_name", unique: true });
}
export default Organizations;
