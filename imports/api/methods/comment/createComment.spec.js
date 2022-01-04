import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import { Random } from "meteor/random";
import "../";
import Tasks from "../../collections/Tasks";
import Comments from "../../collections/Comments";

if (Meteor.isServer) {
  describe("method: comment.create", function () {
    let currentUser;
    let context;
    let organizationId;
    let projectId;
    let taskId;

    beforeEach(function () {
      Organizations.remove({});
      Projects.remove({});
      Tasks.remove({});
      Comments.remove({});
      currentUser = Random.id();
      context = { userId: currentUser };
      organizationId = Meteor.server.method_handlers[
        "organization.create"
      ].apply(context, ["Keela"]);
      projectId = Meteor.server.method_handlers["project.create"].apply(
        context,
        ["Keela", organizationId]
      );
      taskId = Meteor.server.method_handlers["task.create"].apply(context, [
        "Keela",
        "description",
        projectId,
      ]);
    });

    it("can add a new comment", function () {
      const createComment = Meteor.server.method_handlers["comment.create"];

      createComment.apply(context, ["Comment content", taskId]);

      assert.equal(Comments.find().count(), 1);
    });

    it("throws when no content is received", function () {
      const createComment = Meteor.server.method_handlers["comment.create"];

      assert.Throw(() => createComment.apply(context, []));

      assert.equal(Comments.find().count(), 0);
    });

    it("throws when no user is not logged in", function () {
      const createComment = Meteor.server.method_handlers["comment.create"];

      assert.Throw(() => createComment.apply({}, ["Comment content", taskId]));

      assert.equal(Comments.find().count(), 0);
    });

    it("throws when logged user is not member or owner of the organization", function () {
      const createComment = Meteor.server.method_handlers["comment.create"];

      assert.Throw(() =>
        createComment.apply({ userId: Random.id() }, [
          "Comment content",
          taskId,
        ])
      );

      assert.equal(Comments.find().count(), 0);
    });
    it("throws when task doesn't exists", function () {
      const createComment = Meteor.server.method_handlers["comment.create"];
      assert.Throw(() =>
        createComment.apply(context, ["Comment content", Random.id()])
      );
    });
    it("throws when organization doesn't exists", function () {
      const projectId = Projects.insert({
        owner: currentUser,
        name: "Keela2",
        organizationId: Random.id(),
      });
      const taskId = Tasks.insert({ projectId, name: "task2" });
      const createComment = Meteor.server.method_handlers["comment.create"];
      assert.Throw(() =>
        createComment.apply(context, ["Comment content", taskId])
      );
    });
    it("throws when project doesn't exists", function () {
      const projectId = Random.id();
      const taskId = Tasks.insert({ projectId, name: "task2" });
      const createComment = Meteor.server.method_handlers["comment.create"];
      assert.Throw(() =>
        createComment.apply(context, ["Comment content", taskId])
      );
    });
  });
}
