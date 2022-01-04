// Tests for the behavior of the Comments collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from "meteor/meteor";
import { assert } from "chai";
import Comments from "./Comments.js";

if (Meteor.isServer) {
  describe("comments collection", function () {
    it("insert correctly", function () {
      const orgId = Comments.insert({
        owner: this.userId,
        organizationId: "orgId",
        name: "Project1",
        Comments: [],
        createdAt: new Date(),
      });
      const added = Comments.find({ _id: orgId });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, "comments");
      assert.equal(count, 1);
    });
  });
}
