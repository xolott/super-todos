import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Organizations from "../../collections/Organizations";

Meteor.methods({
  "organization.update"(data) {
    check(data.name, String);
    check(data._id, String);
    if (data.owner !== Meteor.userId())
      throw new Meteor.Error(
        "organization.update.unauthorized",
        "Operation not allowed"
      );
    return Organizations.update(
      { _id: data._id },
      {
        $set: {
          name: data.name,
        },
      }
    );
  },
});
