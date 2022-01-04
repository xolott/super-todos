// Tests for the behavior of the organizations collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { resetDatabase } from "meteor/xolvio:cleaner";
import Organizations from "./Organizations.js";

if (Meteor.isServer) {
  describe("organizations collection", function () {
    beforeEach(function () {
      resetDatabase();
    });
    it("insert correctly", function () {
      const orgId = Organizations.insert({
        owner: this.userId,
        name: "Org Test",
        projects: [],
        members: [],
        createdAt: new Date(),
      });
      const added = Organizations.find({ _id: orgId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, "organizations");
      assert.equal(count, 1);
    });
    it("throws exception when the name is duplicated", function () {
      Organizations.insert({
        owner: this.userId,
        name: "Org Test",
        projects: [],
        members: [],
        createdAt: new Date(),
      });
      assert.Throw(() =>
        Organizations.insert({
          owner: this.userId,
          name: "Org Test",
          projects: [],
          members: [],
          createdAt: new Date(),
        })
      );
      const added = Organizations.find({});
      const count = added.count();
      assert.equal(count, 1);
    });
  });
}
