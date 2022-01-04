import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import Projects from "../../collections/Projects";
import Organizations from "../../collections/Organizations";

Meteor.methods({
  "project.create"(name, organizationId) {
    if (
      !this.userId ||
      !Meteor.checkPermissions(organizationId, "project.create")
    )
      throw new Meteor.Error(
        "project.create.unauthorized",
        "Operation not allowed"
      );
    check(name, String);
    const org = Organizations.findOne({ _id: organizationId });
    if (!org)
      throw new Meteor.Error("organization.notFound", "Organization not found");
    if (org.owner !== this.userId && !org.members.includes(this.userId))
      throw new Meteor.Error(
        "organization.unauthorized",
        "Operation not allowed"
      );
    try {
      const id = Projects.insert({
        owner: this.userId,
        organizationId,
        name,
        tasks: [],
        createdAt: new Date(),
      });
      Organizations.update(
        { _id: organizationId },
        { $push: { projects: id } }
      );
      return id;
    } catch (e) {
      throw new Meteor.Error(
        "project.create.duplicated",
        "Project already exists"
      );
    }
  },
});
