import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Comments from "../../collections/Comments";
import Projects from "../../collections/Projects";
import Tasks from "../../collections/Tasks";
import Organizations from "../../collections/Organizations";

Meteor.methods({
  "comment.create"(content, taskId) {
    if (!this.userId) throw new Meteor.Error("comment.unauthorized");
    check(content, String);
    check(taskId, String);
    const task = Tasks.findOne({ _id: taskId });
    if (!task) throw new Meteor.Error("task.notFound", "Task not found");
    const project = Projects.findOne({
      _id: task.projectId,
    });
    if (!project)
      throw new Meteor.Error("project.notFound", "Project not found");
    const org = Organizations.findOne({ _id: project.organizationId });
    if (!org)
      throw new Meteor.Error("organization.notFound", "Organization not found");
    if (
      !Meteor.checkPermissions(org._id, "comment.create") ||
      (org.owner !== this.userId && !org.members.includes(this.userId))
    )
      throw new Meteor.Error(
        "organization.unauthorized",
        "Operation not allowed"
      );
    return Comments.insert({
      userId: this.userId,
      content,
      taskId,
      createdAt: new Date(),
    });
  },
});
