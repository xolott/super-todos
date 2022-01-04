import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { Random } from "meteor/random";
import Organizations from "../../collections/Organizations";

import "../";
if (Meteor.isServer) {
  describe("method: organization.members.delete", function () {
    let currentUser;
    let memberUserId;
    let context;
    let organizationId;

    before(function () {
      currentUser = Random.id();
      context = { userId: currentUser };
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];
      organizationId = createOrganization.apply(context, ["Keela"]);
      memberUserId = Random.id();
      const addMember =
        Meteor.server.method_handlers["organization.members.add"];
      addMember.apply(context, [organizationId, memberUserId]);
    });

    beforeEach(function () {
      Organizations.update({ _id: organizationId }, { $set: { members: [] } });
      const addMember =
        Meteor.server.method_handlers["organization.members.add"];
      addMember.apply(context, [organizationId, memberUserId]);
    });

    it("can delete a member", function () {
      const addMember =
        Meteor.server.method_handlers["organization.members.delete"];

      assert.equal(
        Organizations.findOne({ _id: organizationId }).members.length,
        1
      );
      addMember.apply(context, [organizationId, memberUserId]);
      assert.equal(
        Organizations.findOne({ _id: organizationId }).members.length,
        0
      );
    });

    it("throws when the member doesn't exists", function () {
      const deleteMember =
        Meteor.server.method_handlers["organization.members.delete"];
      assert.Throw(() =>
        deleteMember.apply(context, [organizationId, Random.id()])
      );

      assert.equal(
        Organizations.findOne({ _id: organizationId }).members.length,
        1
      );
    });
    it("throws when the logged user is not the owner", function () {
      const deleteMember =
        Meteor.server.method_handlers["organization.members.delete"];
      assert.Throw(() =>
        deleteMember.apply({ userId: Random.id() }, [
          organizationId,
          Random.id(),
        ])
      );

      assert.equal(
        Organizations.findOne({ _id: organizationId }).members.length,
        1
      );
    });

    it("throws when organization doesn't exists", function () {
      const deleteMember =
        Meteor.server.method_handlers["organization.members.delete"];
      assert.Throw(() =>
        deleteMember.apply(context, [Random.id(), currentUser])
      );
    });

    it("throws when user is not logged in", function () {
      const deleteMember =
        Meteor.server.method_handlers["organization.members.delete"];
      assert.Throw(() => deleteMember.apply({}, [Random.id(), currentUser]));
    });
  });
}
