import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import Roles from "../collections/Roles";

Meteor.checkPermissions = function (organizationId, policies) {
  try {
    check(organizationId, String);
    check(policies, Match.OneOf(String, Array));
  } catch {
    return false;
  }
  policies = Array.isArray(policies) ? policies : [policies];
  if (!this.user()?.roles) return false;
  const role = Roles.findOne({
    name: this.user().roles[organizationId],
  });
  if (!role || policies.some((x) => !role.policies.includes(x))) return false;
  return true;
};
