import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Organizations from "../../collections/Organizations";

Meteor.methods({
  "organization.update"(data) {
    check(data.name, String);
    check(data._id, String);
    const org = Organizations.findOne({ _id: data._id });
    if (!org)
      throw new Meteor.Error("organization.notFound", "Organization not found");
    if (
      !this.userId ||
      !Meteor.checkPermissions(org._id, "organization.update")
    )
      throw new Meteor.Error(
        "organization.update.unauthorized",
        "Operation not allowed"
      );
    if (org.owner !== this.userId)
      throw new Meteor.Error(
        "organization.update.unauthorized",
        "Operation not allowed"
      );
    return Organizations.update(
      { _id: data._id, owner: this.userId },
      {
        $set: {
          name: data.name,
        },
      }
    );
  },
});
