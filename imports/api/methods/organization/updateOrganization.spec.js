import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import Organizations from "../../collections/Organizations";
import { Random } from "meteor/random";
import "../";
if (Meteor.isServer) {
  describe("method: organization.update", function () {
    let currentUser;
    let context;
    let organizationId;

    before(function () {
      currentUser = Random.id();
      context = { userId: currentUser };
    });

    beforeEach(function () {
      Organizations.remove({});
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];
      organizationId = createOrganization.apply(context, ["Keela"]);
    });

    it("can update a organization", function () {
      const updateOrganization =
        Meteor.server.method_handlers["organization.update"];
      const before = Organizations.findOne({ _id: organizationId });
      assert.isNotNull(before);
      updateOrganization.apply(context, [
        { _id: organizationId, name: "new name" },
      ]);
      const after = Organizations.findOne({ _id: organizationId });
      assert.isNotNull(after);
      assert.notEqual(after.name, before.name);
      assert.equal(after.name, "new name");
    });

    it("throws when the logged user is not the owner", function () {
      const updateOrganization =
        Meteor.server.method_handlers["organization.update"];
      assert.Throw(() =>
        updateOrganization.apply({ userId: Random.id() }, [
          { _id: organizationId, name: "new name" },
          Random.id(),
        ])
      );

      assert.equal(Organizations.find({}).count(), 1);
    });

    it("throws when organization doesn't exists", function () {
      const updateOrganization =
        Meteor.server.method_handlers["organization.update"];
      assert.Throw(() =>
        updateOrganization.apply(context, [{ _id: Random.id(), name: "name" }])
      );
    });
    it("throws when user is not logged in", function () {
      const updateOrganization =
        Meteor.server.method_handlers["organization.update"];
      assert.Throw(() =>
        updateOrganization.apply({}, [{ _id: Random.id(), name: "name" }])
      );
    });
  });
}
