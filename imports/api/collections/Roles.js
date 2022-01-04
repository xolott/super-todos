/*
ownner, manager, coordinator
owner can add/remove users
manager can create tasks
coordinator can comment
owner can also create task + comment on tasks
managers can also comment on tasks
but coordinator can only comment
*/

import { Mongo } from "meteor/mongo";

const Roles = new Mongo.Collection("roles");
if (Meteor.isServer) {
  Roles.createIndex({ name: 1 }, { name: "unique_name", unique: true });
}
export default Roles;
