import { Meteor } from "meteor/meteor";

Meteor.publish(null, function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find(
    { _id: this.userId },
    { fields: { username: 1, roles: 1 } }
  );
});
