import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { Random } from "meteor/random";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import Tasks from "../../collections/Tasks";
import Comments from "../../collections/Comments";
import "../";

if (Meteor.isServer) {
  describe("method: project.delete", function () {
    let currentUser;
    let context;
    let organizationId;
    let projectId;

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
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];
      organizationId = createOrganization.apply(context, ["Keela"]);
      const createProject = Meteor.server.method_handlers["project.create"];
      projectId = createProject.apply(context, [
        "Keela Project",
        organizationId,
      ]);
    });

    it("can delete a project", function () {
      const taskId = Tasks.insert({
        organizationId,
        projectId,
      });
      Comments.insert({
        taskId,
      });
      const deleteProject = Meteor.server.method_handlers["project.delete"];

      assert.equal(Projects.find({}).count(), 1);
      assert.equal(Tasks.find({}).count(), 1);
      assert.equal(Comments.find({}).count(), 1);
      deleteProject.apply(context, [projectId]);
      assert.equal(Projects.find({}).count(), 0);
      assert.equal(Tasks.find({}).count(), 0);
      assert.equal(Comments.find({}).count(), 0);
    });

    it("throws when the logged user is not the owner", function () {
      const deleteProject = Meteor.server.method_handlers["project.delete"];
      assert.Throw(() =>
        deleteProject.apply({ userId: Random.id() }, [projectId, Random.id()])
      );

      assert.equal(Projects.find({}).count(), 1);
    });

    it("throws when project doesn't exists", function () {
      const deleteProject = Meteor.server.method_handlers["project.delete"];
      assert.Throw(() => deleteProject.apply(context, [Random.id()]));
    });

    it("throws when user is not logged in", function () {
      const deleteProject = Meteor.server.method_handlers["project.delete"];
      assert.Throw(() => deleteProject.apply({}, [Random.id()]));
    });

    it("throws when organization doesn't exists", function () {
      const deleteProject = Meteor.server.method_handlers["project.delete"];
      const projectId = Projects.insert({
        owner: currentUser,
        name: "Keela2",
        organizationId: Random.id(),
      });
      assert.Throw(() => deleteProject.apply(context, [projectId]));
    });
  });
}
