import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import Organizations from "../../collections/Organizations";
import { Random } from "meteor/random";
import "../";

if (Meteor.isServer) {
  describe("method: organization.members.add", function () {
    let currentUser;
    let context;
    let organizationId;

    beforeEach(function () {
      Organizations.remove({});
      currentUser = Random.id();
      context = { userId: currentUser };
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];
      organizationId = createOrganization.apply(context, ["Keela"]);
    });

    it("can add a new member", function () {
      const addMember =
        Meteor.server.method_handlers["organization.members.add"];

      addMember.apply(context, [organizationId, Random.id()]);

      assert.equal(
        Organizations.findOne({ _id: organizationId }).members.length,
        1
      );
    });

    it("can't add the owner as a new member", function () {
      const addMember =
        Meteor.server.method_handlers["organization.members.add"];
      assert.Throw(() =>
        addMember.apply(context, [organizationId, currentUser])
      );

      assert.equal(
        Organizations.findOne({ _id: organizationId }).members.length,
        0
      );
    });

    it("can't add the same member more than once", function () {
      const addMember =
        Meteor.server.method_handlers["organization.members.add"];
      const newMember = Random.id();
      addMember.apply(context, [organizationId, newMember]);
      assert.Throw(() => addMember.apply(context, [organizationId, newMember]));

      assert.equal(
        Organizations.findOne({ _id: organizationId }).members.length,
        1
      );
    });

    it("throws when organization doesn't exists", function () {
      const addMember =
        Meteor.server.method_handlers["organization.members.add"];
      assert.Throw(() => addMember.apply(context, [Random.id(), currentUser]));
    });

    it("throws when user is not logged in", function () {
      const addMember =
        Meteor.server.method_handlers["organization.members.add"];
      assert.Throw(() => addMember.apply({}, [Random.id(), currentUser]));
    });
  });
}
