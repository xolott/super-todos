import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Tasks from "../../collections/Tasks";
import Comments from "../../collections/Comments";

Meteor.methods({
  "task.delete"(taskId) {
    if (!this.userId)
      throw new Meteor.Error("task.unauthorized", "Operation not allowed");
    check(taskId, String);
    const task = Tasks.findOne({ _id: taskId });
    if (!task) throw new Meteor.Error("task.notFound", "Task not found");

    if (!Meteor.checkPermissions(task.organizationId, "task.delete"))
      throw new Meteor.Error(
        "task.delete.unauthorized",
        "Operation not allowed"
      );
    Comments.remove({ taskId });
    return Tasks.remove(taskId);
  },
});
