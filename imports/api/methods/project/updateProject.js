import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Projects from "../../collections/Projects";

Meteor.methods({
  "project.update"(data) {
    check(data.name, String);
    check(data._id, String);
    check(data.organizationId, String);
    const project = Projects.findOne({ _id: data._id });
    if (!project)
      throw new Meteor.Error("project.notFound", "Project not found");
    if (
      !this.userId ||
      project.owner !== this.userId ||
      !Meteor.checkPermissions(data.organizationId, "project.update")
    )
      throw new Meteor.Error(
        "project.update.unauthorized",
        "Project not allowed"
      );
    return Projects.update(
      { _id: data._id },
      {
        $set: {
          name: data.name,
        },
      }
    );
  },
});
