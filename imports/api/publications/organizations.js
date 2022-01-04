import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { publishComposite } from "meteor/reywood:publish-composite";
import Organizations from "../collections/Organizations";

Meteor.publish("organizations.list", function () {
  if (!this.userId) {
    return this.ready();
  }
  return Organizations.find({
    $or: [
      { owner: this.userId },
      { members: { $elemMatch: { $eq: this.userId } } },
    ],
  });
});

Meteor.publish("organization.get", function (orgId) {
  if (!this.userId || !orgId) {
    return this.ready();
  }
  check(orgId, String);
  return Organizations.find({
    _id: orgId,
  });
});

publishComposite("organization.members", function (orgId) {
  if (!this.userId || !orgId) {
    return this.ready();
  }
  check(orgId, String);
  const org = Organizations.findOne({
    _id: orgId,
  });
  if (!org) {
    throw new Meteor.Error("organization.not_found", "Operation not found");
  }
  return {
    find() {
      return Organizations.find({ _id: orgId });
    },
    children: [
      {
        find(org) {
          return Meteor.users.find(
            {
              _id: { $in: [org.owner, ...org.members] },
            },
            {
              fields: {
                username: 1,
                roles: {
                  [orgId]: 1,
                },
              },
            }
          );
        },
      },
    ],
  };
});

publishComposite("organization.nonMembers", function (orgId) {
  if (!this.userId || !orgId) {
    return this.ready();
  }
  check(orgId, String);
  const org = Organizations.findOne({
    _id: orgId,
  });
  if (!org) {
    throw new Meteor.Error("organization.not_found", "Operation not found");
  }
  return {
    find() {
      return Organizations.find({ _id: orgId });
    },
    children: [
      {
        find(org) {
          return Meteor.users.find(
            {
              _id: { $nin: [org.owner, ...org.members] },
            },
            {
              fields: {
                username: 1,
              },
            }
          );
        },
      },
    ],
  };
});
