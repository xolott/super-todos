import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import Organizations from "../../collections/Organizations";
import { Random } from "meteor/random";
import "../";

if (Meteor.isServer) {
  describe("method: organization.create", function () {
    let currentUser;
    let context;
    beforeEach(function () {
      Organizations.remove({});
      currentUser = Random.id();
      context = { userId: currentUser };
    });

    it("can add a new organization", function () {
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];

      createOrganization.apply(context, ["Keela"]);

      assert.equal(Organizations.find().count(), 1);
    });

    it("throws when name is duplicated", function () {
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];
      createOrganization.apply(context, ["Keela"]);
      assert.Throw(() => createOrganization.apply(context, ["Keela"]));

      assert.equal(Organizations.find().count(), 1);
    });

    it("throws when no name is received", function () {
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];

      assert.Throw(() => createOrganization.apply(context, []));

      assert.equal(Organizations.find().count(), 0);
    });

    it("throws when no user is not logged in", function () {
      const createOrganization =
        Meteor.server.method_handlers["organization.create"];

      assert.Throw(() => createOrganization.apply({}, ["Keela"]));

      assert.equal(Organizations.find().count(), 0);
    });
  });
}
