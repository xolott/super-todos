import { assert } from "chai";
import { PublicationCollector } from "meteor/johanbrook:publication-collector";
import { Random } from "meteor/random";
import Organizations from "../collections/Organizations.js";
import "./";

describe("Publish organizations", function () {
  let context;
  let currentUser;
  let organizationId;

  beforeEach(function () {
    Meteor.users.remove({});
    currentUser = Accounts.createUser({
      email: "someemail@asd.com",
      password: "somepassword",
      profile: { name: "someusername" },
    });
    Accounts.createUser({
      email: "someemail3@asd.com",
      password: "somepassword",
      profile: { name: "someusername3" },
    });
    context = { userId: currentUser };
    Organizations.remove({});
    organizationId = Organizations.insert({
      name: "Keela",
      owner: currentUser,
      members: [
        Accounts.createUser({
          email: "someemail2@asd.com",
          password: "somepassword",
          profile: { name: "someusername2" },
        }),
      ],
    });
    Organizations.insert({
      name: "Keela2",
      owner: currentUser,
      members: [],
    });
  });

  describe("organizations.list", function () {
    it("sends data when user is logged", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("organizations.list", (collections) => {
        assert.equal(collections.organizations.length, 2);
        done();
      });
    });

    it("not send data when user isn't logged", function (done) {
      const collector = new PublicationCollector();
      collector.collect("organizations.list", (collections) => {
        assert.equal(Object.keys(collections), 0);
        done();
      });
    });
  });

  describe("organization.get", function () {
    it("sends data when user is logged", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("organization.get", organizationId, (collections) => {
        assert.equal(collections.organizations.length, 1);
        done();
      });
    });

    it("throws when no organization id is received", function () {
      const collector = new PublicationCollector(context);
      collector
        .collect("organization.get")
        .then(() => Promise.reject(new Error("Expected method to reject.")))
        .catch((err) => assert.instanceOf(err, Error));
    });

    it("not send data when user isn't logged", function (done) {
      const collector = new PublicationCollector();
      collector.collect("organization.get", organizationId, (collections) => {
        assert.equal(Object.keys(collections), 0);
        done();
      });
    });
  });
  describe("organization.members", function () {
    it("sends data when user is logged", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect(
        "organization.members",
        organizationId,
        (collections) => {
          assert.equal(collections.users.length, 2); // Logged user and 1 member
          done();
        }
      );
    });

    it("throws when no organization id is received", function () {
      const collector = new PublicationCollector(context);
      collector
        .collect("organization.members")
        .then(() => Promise.reject(new Error("Expected method to reject.")))
        .catch((err) => assert.instanceOf(err, Error));
    });
    it("throws when organization doesn't exists", function () {
      const collector = new PublicationCollector(context);
      collector
        .collect("organization.members", Random.id())
        .then(() => Promise.reject(new Error("Expected method to reject.")))
        .catch((err) => assert.instanceOf(err, Error));
    });

    it("not send info when user isn't logged", function (done) {
      const collector = new PublicationCollector();
      collector.collect(
        "organization.members",
        organizationId,
        (collections) => {
          assert.equal(Object.keys(collections), 0);
          done();
        }
      );
    });
  });

  describe("organization.nonMembers", function () {
    it("sends data when user is logged", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect(
        "organization.nonMembers",
        organizationId,
        (collections) => {
          assert.equal(collections.users.length, 1);
          done();
        }
      );
    });

    it("throws when no organization id is received", function () {
      const collector = new PublicationCollector(context);
      collector
        .collect("organization.nonMembers")
        .then(() => Promise.reject(new Error("Expected method to reject.")))
        .catch((err) => assert.instanceOf(err, Error));
    });
    it("throws when organization doesn't exists", function () {
      const collector = new PublicationCollector(context);
      collector
        .collect("organization.nonMembers", Random.id())
        .then(() => Promise.reject(new Error("Expected method to reject.")))
        .catch((err) => assert.instanceOf(err, Error));
    });

    it("not send info when user isn't logged", function (done) {
      const collector = new PublicationCollector();
      collector.collect(
        "organization.nonMembers",
        organizationId,
        (collections) => {
          assert.equal(Object.keys(collections), 0);
          done();
        }
      );
    });
  });
});
