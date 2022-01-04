// Tests for the behavior of the Projects collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import { resetDatabase } from "meteor/xolvio:cleaner";
import Projects from "./Projects.js";

if (Meteor.isServer) {
  describe("projects collection", function () {
    beforeEach(function () {
      resetDatabase();
    });
    it("insert correctly", function () {
      const orgId = Projects.insert({
        owner: this.userId,
        organizationId: "orgId",
        name: "Project1",
        tasks: [],
        createdAt: new Date(),
      });
      const added = Projects.find({ _id: orgId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, "projects");
      assert.equal(count, 1);
    });
    it("throws exception when the name is duplicated", function () {
      Projects.insert({
        owner: this.userId,
        organizationId: "orgId",
        name: "Project1",
        tasks: [],
        createdAt: new Date(),
      });
      assert.Throw(() =>
        Projects.insert({
          owner: this.userId,
          organizationId: "orgId",
          name: "Project1",
          tasks: [],
          createdAt: new Date(),
        })
      );
      const added = Projects.find({});
      const count = added.count();
      assert.equal(count, 1);
    });
  });
}
