import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { Random } from "meteor/random";
import Organizations from "../../collections/Organizations";
import Projects from "../../collections/Projects";
import Tasks from "../../collections/Tasks";
import Comments from "../../collections/Comments";
import "../";

if (Meteor.isServer) {
  describe("method: organization.delete", function () {
    let currentUser;
    let memberUserId;
    let context;
    let organizationId;

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
      const addMember =
        Meteor.server.method_handlers["organization.members.add"];
      addMember.apply(context, [organizationId, memberUserId]);
    });

    it("can delete a organization", function () {
      Projects.insert({
        organizationId,
      });
      const taskId = Tasks.insert({
        organizationId,
      });
      Comments.insert({
        taskId,
      });
      const deleteOrganization =
        Meteor.server.method_handlers["organization.delete"];

      assert.equal(Organizations.find({}).count(), 1);
      assert.equal(Projects.find({}).count(), 1);
      assert.equal(Tasks.find({}).count(), 1);
      assert.equal(Comments.find({}).count(), 1);
      deleteOrganization.apply(context, [organizationId]);
      assert.equal(Organizations.find({}).count(), 0);
      assert.equal(Projects.find({}).count(), 0);
      assert.equal(Tasks.find({}).count(), 0);
      assert.equal(Comments.find({}).count(), 0);
    });

    it("throws when the logged user is not the owner", function () {
      const deleteOrganization =
        Meteor.server.method_handlers["organization.delete"];
      assert.Throw(() =>
        deleteOrganization.apply({ userId: Random.id() }, [
          organizationId,
          Random.id(),
        ])
      );

      assert.equal(Organizations.find({}).count(), 1);
    });

    it("throws when organization doesn't exists", function () {
      const deleteOrganization =
        Meteor.server.method_handlers["organization.delete"];
      assert.Throw(() =>
        deleteOrganization.apply(context, [Random.id(), currentUser])
      );
    });
  });
}
