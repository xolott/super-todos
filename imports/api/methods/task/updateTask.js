import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Tasks from "../../collections/Tasks";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";

Meteor.methods({
  "task.update"(data, projectId) {
    check(data._id, String);
    check(data.name, String);
    check(data.description, String);
    check(projectId, String);

    const project = Projects.findOne({ _id: projectId });
    if (!project) throw new Meteor.Error("notFound", "Porject not found");
    const org = Organizations.findOne({ _id: project.organizationId });
    if (!org) throw new Meteor.Error("notFound", "Organization not found");
    if (
      ![org.owner, ...org.members].includes(this.userId) ||
      !Meteor.checkPermissions(org._id, "task.update")
    )
      throw new Meteor.Error("unauthorized", "Operation not allowed");

    return Tasks.update(
      { _id: data._id },
      {
        $set: {
          name: data.name,
          description: data.description,
        },
      }
    );
  },
});
