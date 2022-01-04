import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import Projects from "../collections/Projects";
import Organizations from "../collections/Organizations";

Meteor.publish("projects.list", function (orgId = null) {
  if (!this.userId) {
    return this.ready();
  }
  check(orgId, Match.Maybe(String));
  return Projects.find(orgId ? { organizationId: orgId } : {});
});

publishComposite("project.get", function (projectId, orgId = null) {
  if (!this.userId || !projectId) {
    return this.ready();
  }
  check(projectId, String);
  check(orgId, Match.Maybe(String));

  return {
    find() {
      const selector = {
        ...(orgId ? { _id: orgId } : {}),
        $or: [
          { owner: this.userId },
          { members: { $elemMatch: { $eq: this.userId } } },
        ],
      };
      return Organizations.find(selector);
    },
    children: [
      {
        find(org) {
          return Projects.find({ _id: projectId, organizationId: org._id });
        },
      },
    ],
  };
});
