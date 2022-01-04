// Tests for the behavior of the Tasks collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { resetDatabase } from "meteor/xolvio:cleaner";
import Tasks from "./Tasks.js";

if (Meteor.isServer) {
  describe("tasks collection", function () {
    beforeEach(function () {
      resetDatabase();
    });
    it("insert correctly", function () {
      const orgId = Tasks.insert({
        owner: this.userId,
        organizationId: "orgId",
        name: "Project1",
        tasks: [],
        createdAt: new Date(),
      });
      const added = Tasks.find({ _id: orgId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, "tasks");
      assert.equal(count, 1);
    });
    it("throws exception when the name is duplicated", function () {
      Tasks.insert({
        owner: this.userId,
        organizationId: "orgId",
        name: "Project1",
        tasks: [],
        createdAt: new Date(),
      });
      assert.Throw(() =>
        Tasks.insert({
          owner: this.userId,
          organizationId: "orgId",
          name: "Project1",
          tasks: [],
          createdAt: new Date(),
        })
      );
      const added = Tasks.find({});
      const count = added.count();
      assert.equal(count, 1);
    });
  });
}
