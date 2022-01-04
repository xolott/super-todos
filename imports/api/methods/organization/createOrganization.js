import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Organizations from "../../collections/Organizations";
import Roles from "../../collections/Roles";

Meteor.methods({
  "organization.create"(name) {
    if (!this.userId) {
      throw new Meteor.Error(
        "organization.create.unauthorized",
        "Operation not allowed"
      );
    }
    check(name, String);
    try {
      const orgId = Organizations.insert({
        owner: this.userId,
        name,
        projects: [],
        members: [],
        createdAt: new Date(),
      });
      Meteor.users.update(
        { _id: this.userId },
        {
          $set: {
            [`roles.${orgId}`]: "owner",
          },
        }
      );
      return orgId;
    } catch {
      throw new Meteor.Error(
        "organization.create.duplicated",
        "Organization already exists"
      );
    }
  },
});
