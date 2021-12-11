import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Organizations from "../../collections/Organizations";

Meteor.methods({
  "organization.create"(name) {
    check(name, String);
    try {
      return Organizations.insert({
        owner: Meteor.userId(),
        name,
        projects: [],
        members: [],
        createdAt: new Date(),
      });
    } catch (e) {
      throw new Meteor.Error(
        "organization.create.duplicated",
        "Organization already exists"
      );
    }
  },
});
