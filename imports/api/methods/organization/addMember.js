import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Organizations from "../../collections/Organizations";
import Roles from "../../collections/Roles";

Meteor.methods({
  "organization.members.add"(organizationId, userId, role) {
    check(organizationId, String);
    check(userId, String);
    check(role, String);
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
    if (!Roles.findOne({ name: role })) {
      throw new Meteor.Error("role.notFound", "Invalid role");
    }
    if (userId === org.owner)
      throw new Meteor.Error(
        "organization.badRequest",
        "Owner can't be added as member"
      );
    if (org.members.includes(userId))
      throw new Meteor.Error(
        "organization.badRequest",
        "User is already a member"
      );
    Meteor.users.update(
      { _id: userId },
      {
        $set: {
          [`roles.${organizationId}`]: role,
        },
      }
    );
    return Organizations.update(
      { _id: organizationId },
      {
        $push: {
          members: userId,
        },
      }
    );
  },
});
