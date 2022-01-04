import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { Random } from "meteor/random";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import "../";
import Tasks from "../../collections/Tasks";

if (Meteor.isServer) {
  describe("method: task.update", function () {
    let currentUser;
    let context;
    let organizationId;
    let projectId;
    let taskId;

    before(function () {
      currentUser = Random.id();
      context = { userId: currentUser };
    });

    beforeEach(function () {
      Organizations.remove({});
      Projects.remove({});
      Tasks.remove({});
      organizationId = Meteor.server.method_handlers[
        "organization.create"
      ].apply(context, ["Keela"]);
      projectId = Meteor.server.method_handlers["project.create"].apply(
        context,
        ["Keela", organizationId]
      );
      taskId = Meteor.server.method_handlers["task.create"].apply(context, [
        "Task",
        "description",
        projectId,
      ]);
    });

    it("can update a task", function () {
      const updateTask = Meteor.server.method_handlers["task.update"];
      updateTask.apply(context, [
        {
          _id: taskId,
          name: "new name",
          description: "new description",
        },
        projectId,
      ]);
      const task = Tasks.findOne({ _id: taskId });
      assert.isNotNull(task);
      assert.equal(task.name, "new name");
    });

    it("throws when the logged user is not the owner", function () {
      const updateTask = Meteor.server.method_handlers["task.update"];
      assert.Throw(() =>
        updateTask.apply({ userId: Random.id() }, [
          {
            _id: taskId,
            name: "new name",
            description: "new description",
          },
          projectId,
        ])
      );

      assert.equal(Projects.find({}).count(), 1);
    });

    it("throws when user is not logged in", function () {
      const updateTask = Meteor.server.method_handlers["task.update"];
      assert.Throw(() =>
        updateTask.apply({}, [
          {
            _id: taskId,
            name: "new name",
            description: "new description",
          },
          projectId,
        ])
      );
    });
    it("throws when project doesn't exists", function () {
      const updateTask = Meteor.server.method_handlers["task.update"];
      assert.Throw(() =>
        updateTask.apply({}, [
          {
            _id: taskId,
            name: "new name",
            description: "new description",
          },
          Random.id(),
        ])
      );
    });
    it("throws when organization doesn't exists", function () {
      const projectId = Projects.insert({
        owner: currentUser,
        name: "Keela2",
        organizationId: Random.id(),
      });
      const taskId = Tasks.insert({ projectId, name: "task2" });
      const updateTask = Meteor.server.method_handlers["task.update"];
      assert.Throw(() =>
        updateTask.apply({}, [
          {
            _id: taskId,
            name: "new name",
            description: "new description",
          },
          projectId,
        ])
      );
    });
  });
}
