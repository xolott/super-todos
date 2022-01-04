import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { Random } from "meteor/random";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import Tasks from "../../collections/Tasks";
import Comments from "../../collections/Comments";
import "../";

if (Meteor.isServer) {
  describe("method: task.delete", function () {
    let currentUser;
    let context;
    let organizationId;
    let projectId;
    let taskId;

    before(function () {
      currentUser = Random.id();
      context = { userId: currentUser };
      memberUserId = Random.id();
    });

    beforeEach(function () {
      Organizations.remove({});
      Projects.remove({});
      Tasks.remove({});
      Comments.remove({});
      organizationId = Meteor.server.method_handlers[
        "organization.create"
      ].apply(context, ["Keela"]);
      projectId = Meteor.server.method_handlers["project.create"].apply(
        context,
        ["Keela Project", organizationId]
      );
      taskId = Meteor.server.method_handlers["task.create"].apply(context, [
        "Task",
        "description",
        projectId,
      ]);
    });

    it("can delete a task", function () {
      Comments.insert({
        taskId,
      });
      const deleteTask = Meteor.server.method_handlers["task.delete"];

      assert.equal(Tasks.find({}).count(), 1);
      assert.equal(Comments.find({}).count(), 1);
      deleteTask.apply(context, [taskId]);
      assert.equal(Tasks.find({}).count(), 0);
      assert.equal(Comments.find({}).count(), 0);
    });

    it("throws when the logged user is not the owner", function () {
      const deleteTask = Meteor.server.method_handlers["task.delete"];
      assert.Throw(() => deleteTask.apply({ userId: Random.id() }, [taskId]));

      assert.equal(Tasks.find({}).count(), 1);
    });

    it("throws when task doesn't exists", function () {
      const deleteTask = Meteor.server.method_handlers["task.delete"];
      assert.Throw(() => deleteTask.apply(context, [Random.id()]));
    });

    it("throws when user is not logged in", function () {
      const deleteTask = Meteor.server.method_handlers["task.delete"];
      assert.Throw(() => deleteTask.apply({}, [taskId]));
    });
  });
}
