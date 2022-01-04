import Roles from "../collections/Roles";

Meteor.publish(null, function () {
  return Roles.find({});
});
