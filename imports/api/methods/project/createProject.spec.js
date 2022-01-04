import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import { Random } from "meteor/random";
import "../";

if (Meteor.isServer) {
  describe("method: project.create", function () {
    let currentUser;
    let context;
    let organizationId;

    beforeEach(function () {
      Organizations.remove({});
      Projects.remove({});
      currentUser = Random.id();
      context = { userId: currentUser };
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];
      organizationId = createOrganization.apply(context, ["Keela"]);
    });

    it("can add a new project", function () {
      const createProject = Meteor.server.method_handlers["project.create"];

      createProject.apply(context, ["Keela Project", organizationId]);

      assert.equal(Projects.find().count(), 1);
    });

    it("throws when name is duplicated", function () {
      const createProject = Meteor.server.method_handlers["project.create"];
      createProject.apply(context, ["Keela Project", organizationId]);
      assert.Throw(() =>
        createProject.apply(context, ["Keela Project", organizationId])
      );

      assert.equal(Projects.find().count(), 1);
    });

    it("throws when no name is received", function () {
      const createProject = Meteor.server.method_handlers["project.create"];

      assert.Throw(() => createProject.apply(context, []));

      assert.equal(Projects.find().count(), 0);
    });

    it("throws when no user is not logged in", function () {
      const createProject = Meteor.server.method_handlers["project.create"];

      assert.Throw(() =>
        createProject.apply({}, ["Keela Project", organizationId])
      );

      assert.equal(Projects.find().count(), 0);
    });

    it("throws when logged user is not member or owner of the organization", function () {
      const createProject = Meteor.server.method_handlers["project.create"];

      assert.Throw(() =>
        createProject.apply({ userId: Random.id() }, [
          "Keela Project",
          organizationId,
        ])
      );

      assert.equal(Projects.find().count(), 0);
    });
    it("throws when organization doesn't exists", function () {
      const createProject = Meteor.server.method_handlers["project.create"];
      assert.Throw(() =>
        createProject.apply(context, ["Keela Project", Random.id()])
      );
    });
  });
}
