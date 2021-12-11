import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Organizations from "../../collections/Organizations";

Meteor.methods({
  "organization.delete"(data) {
    check(data._id, String);
    if (data.owner !== Meteor.userId())
      throw new Meteor.Error(
        "organization.delete.unauthorized",
        "Operation not allowed"
      );
    return Organizations.remove(data._id);
  },
});
