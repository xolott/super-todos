import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import Tasks from "../../collections/Tasks";
import Projects from "../../collections/Projects";
import Organizations from "../../collections/Organizations";

Meteor.methods({
  "task.create"(name, description, projectId) {
    if (!this.userId)
      throw new Meteor.Error("unauthorized", "Operation not allowed");
    check(name, String);
    check(description, Match.Maybe(String));
    check(projectId, String);
    const project = Projects.findOne({ _id: projectId });
    if (!project) throw new Meteor.Error("notFound", "Porject not found");
    const org = Organizations.findOne({ _id: project.organizationId });
    if (
      ![org.owner, ...org.members].includes(this.userId) ||
      !Meteor.checkPermissions(org._id, "task.create")
    )
      throw new Meteor.Error("unauthorized", "Operation not allowed");

    try {
      return Tasks.insert({
        owner: this.userId,
        name,
        description,
        projectId: project._id,
        organizationId: org._id,
        createdAt: new Date(),
      });
    } catch (e) {
      throw new Meteor.Error("task.create.duplicated", "Task already exists");
    }
  },
});
