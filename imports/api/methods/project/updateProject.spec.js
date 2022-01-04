import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { Random } from "meteor/random";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import "../";

if (Meteor.isServer) {
  describe("method: project.update", function () {
    let currentUser;
    let context;
    let organizationId;
    let projectId;

    before(function () {
      currentUser = Random.id();
      context = { userId: currentUser };
    });

    beforeEach(function () {
      Organizations.remove({});
      Projects.remove({});
      organizationId = Meteor.server.method_handlers[
        "organization.create"
      ].apply(context, ["Keela"]);
      projectId = Meteor.server.method_handlers["project.create"].apply(
        context,
        ["Keela", organizationId]
      );
    });

    it("can update a project", function () {
      const updateProject = Meteor.server.method_handlers["project.update"];
      updateProject.apply(context, [{ _id: projectId, name: "new name" }]);
      const project = Projects.findOne({ _id: projectId });
      assert.isNotNull(project);
      assert.equal(project.name, "new name");
    });

    it("throws when the logged user is not the owner", function () {
      const updateProject = Meteor.server.method_handlers["project.update"];
      assert.Throw(() =>
        updateProject.apply({ userId: Random.id() }, [
          { _id: projectId, name: "new name" },
          Random.id(),
        ])
      );

      assert.equal(Projects.find({}).count(), 1);
    });

    it("throws when user is not logged in", function () {
      const updateProject = Meteor.server.method_handlers["project.update"];
      assert.Throw(() =>
        updateProject.apply({}, [{ _id: Random.id(), name: "name" }])
      );
    });
  });
}
