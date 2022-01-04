import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import Tasks from "../../collections/Tasks";
import Comments from "../../collections/Comments";

Meteor.methods({
  "organization.delete"(orgId) {
    check(orgId, String);
    const org = Organizations.findOne({ _id: orgId });
    if (!org) {
      throw new Meteor.Error("organization.notFound", "Organization not found");
    }
    if (
      !this.userId ||
      !Meteor.checkPermissions(org._id, "organization.delete") ||
      org.owner !== this.userId
    )
      throw new Meteor.Error(
        "organization.delete.unauthorized",
        "Operation not allowed"
      );
    const tasks = Tasks.find({ organizationId: orgId }).map((x) => x._id);
    Projects.remove({ organizationId: orgId });
    Tasks.remove({ organizationId: orgId });
    Comments.remove({ taskId: { $in: tasks } });
    Meteor.users.update(
      {},
      {
        $unset: {
          [`roles.${orgId}`]: 1,
        },
      },
      { multi: true }
    );
    return Organizations.remove(orgId);
  },
});
