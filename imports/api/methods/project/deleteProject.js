import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Projects from "../../collections/Projects";
import Organizations from "../../collections/Organizations";
import Tasks from "../../collections/Tasks";
import Comments from "../../collections/Comments";

Meteor.methods({
  "project.delete"(projectId) {
    check(projectId, String);

    if (!this.userId)
      throw new Meteor.Error(
        "project.delete.unauthorized",
        "Operation not allowed"
      );
    const project = Projects.findOne({ _id: projectId });
    if (!project)
      throw new Meteor.Error("project.notFound", "Project not found");
    const org = Organizations.findOne({ _id: project.organizationId });
    if (!org)
      throw new Meteor.Error("organization.notFound", "Organization not found");
    if (
      project.owner !== this.userId ||
      !Meteor.checkPermissions(org._id, "project.delete")
    )
      throw new Meteor.Error(
        "project.delete.unauthorized",
        "Operation not allowed"
      );
    Organizations.update(
      { _id: project.organizationId },
      { $pull: { projects: projectId } }
    );
    const taskIds = Tasks.find({ projectId: project._id }).map((x) => x._id);
    Comments.remove({ taskId: { $in: taskIds } });
    Tasks.remove({ projectId: project._id });
    return Projects.remove(projectId);
  },
});
