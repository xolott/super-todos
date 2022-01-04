import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import { Random } from "meteor/random";
import "../";
import Tasks from "../../collections/Tasks";

if (Meteor.isServer) {
  describe("method: task.create", function () {
    let currentUser;
    let context;
    let organizationId;
    let projectId;

    beforeEach(function () {
      Organizations.remove({});
      Projects.remove({});
      Tasks.remove({});
      currentUser = Random.id();
      context = { userId: currentUser };
      organizationId = Meteor.server.method_handlers[
        "organization.create"
      ].apply(context, ["Keela"]);
      projectId = Meteor.server.method_handlers["project.create"].apply(
        context,
        ["Keela", organizationId]
      );
    });

    it("can add a new task", function () {
      const createTask = Meteor.server.method_handlers["task.create"];

      createTask.apply(context, ["Keela Task", "Task description", projectId]);

      assert.equal(Tasks.find().count(), 1);
    });

    it("throws when name is duplicated", function () {
      const createTask = Meteor.server.method_handlers["task.create"];
      createTask.apply(context, ["Keela Task", "Task description", projectId]);
      assert.Throw(() =>
        createTask.apply(context, ["Keela Task", "Task description", projectId])
      );

      assert.equal(Tasks.find().count(), 1);
    });

    it("throws when no name is received", function () {
      const createTask = Meteor.server.method_handlers["task.create"];

      assert.Throw(() => createTask.apply(context, []));

      assert.equal(Tasks.find().count(), 0);
    });

    it("throws when no user is not logged in", function () {
      const createTask = Meteor.server.method_handlers["task.create"];

      assert.Throw(() =>
        createTask.apply({}, ["Keela Task", "description", projectId])
      );

      assert.equal(Tasks.find().count(), 0);
    });

    it("throws when logged user is not member or owner of the organization", function () {
      const createTask = Meteor.server.method_handlers["task.create"];

      assert.Throw(() =>
        createTask.apply({ userId: Random.id() }, [
          "Keela Project",
          "description",
          projectId,
        ])
      );

      assert.equal(Tasks.find().count(), 0);
    });
    it("throws when project doesn't exists", function () {
      const createTask = Meteor.server.method_handlers["task.create"];
      assert.Throw(() =>
        createTask.apply(context, ["Keela Project", "description", Random.id()])
      );
    });
  });
}
