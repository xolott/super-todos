import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Organizations from "../../collections/Organizations";

Meteor.methods({
  "organization.members.delete"(organizationId, userId) {
    check(organizationId, String);
    check(userId, String);
    if (
      !this.userId ||
      !Meteor.checkPermissions(organizationId, "organization.update")
    )
      throw new Meteor.Error(
        "organization.update.unauthorized",
        "Operation not allowed"
      );
    const org = Organizations.findOne({ _id: organizationId });
    if (!org)
      throw new Meteor.Error("organization.notFound", "Organization not found");
    if (org.owner !== this.userId)
      throw new Meteor.Error(
        "organization.unauthorized",
        "Operation not allowed"
      );

    if (!org.members.includes(userId))
      throw new Meteor.Error("organization.badRequest", "User is not a member");

    return Organizations.update(
      { _id: organizationId, owner: this.userId },
      {
        $pull: {
          members: userId,
        },
      }
    );
  },
});
