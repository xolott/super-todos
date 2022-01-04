import { assert } from "chai";
import { PublicationCollector } from "meteor/johanbrook:publication-collector";
import { Random } from "meteor/random";
import Organizations from "../collections/Organizations.js";
import "./";
import Projects from "../collections/Projects.js";

describe("Publish projects", function () {
  let context;
  let currentUser;
  let organizationId;
  let projectID;

  beforeEach(function () {
    currentUser = Random.id();
    context = { userId: currentUser };
    Organizations.remove({});
    Projects.remove({});
    organizationId = Organizations.insert({
      name: "Keela",
      owner: currentUser,
      members: [],
    });
    projectId = Projects.insert({
      name: "Keela Project",
      owner: currentUser,
      organizationId,
    });
    const organizationId2 = Organizations.insert({
      name: "Keela2",
      owner: currentUser,
      members: [],
    });
    Projects.insert({
      name: "Keela2 Project",
      owner: currentUser,
      organizationId2,
    });
  });

  describe("projects.list", function () {
    it("sends data when user is logged and organizationId is specified", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("projects.list", organizationId, (collections) => {
        assert.equal(collections.projects.length, 1);
        done();
      });
    });
    it("sends data when user is logged and organizationId is not specified", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("projects.list", (collections) => {
        assert.equal(collections.projects.length, 2);
        done();
      });
    });

    it("not send data when user isn't logged", function (done) {
      const collector = new PublicationCollector();
      collector.collect("projects.list", (collections) => {
        assert.equal(Object.keys(collections), 0);
        done();
      });
    });
  });

  describe("project.get", function () {
    it("sends data when user is logged and organizationId is specified", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect(
        "project.get",
        projectId,
        organizationId,
        (collections) => {
          assert.equal(collections.projects.length, 1);
          done();
        }
      );
    });
    it("sends data when user is logged and organizationId is not specified", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("project.get", projectId, (collections) => {
        assert.equal(collections.projects.length, 1);
        done();
      });
    });

    it("not send data when projectId isn't provided", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("project.get", (collections) => {
        assert.equal(Object.keys(collections), 0);
        done();
      });
    });
    it("not send data when user isn't logged", function (done) {
      const collector = new PublicationCollector();
      collector.collect("project.get", (collections) => {
        assert.equal(Object.keys(collections), 0);
        done();
      });
    });
  });
});
