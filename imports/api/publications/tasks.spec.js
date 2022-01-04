import { assert } from "chai";
import { PublicationCollector } from "meteor/johanbrook:publication-collector";
import { Random } from "meteor/random";
import Organizations from "../collections/Organizations.js";
import ".";
import Projects from "../collections/Projects.js";
import Tasks from "../collections/Tasks.js";
import Comments from "../collections/Comments.js";

describe("Publish taks", function () {
  let context;
  let currentUser;
  let organizationId;
  let projectID;
  let taskId;

  beforeEach(function () {
    currentUser = Random.id();
    context = { userId: currentUser };
    Organizations.remove({});
    Projects.remove({});
    Tasks.remove({});

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
    taskId = Tasks.insert({
      name: "task",
      projectId,
      organizationId,
    });
    Comments.insert({ taskId, content: "comment" });
    const organizationId2 = Organizations.insert({
      name: "Keela2",
      owner: currentUser,
      members: [],
    });
    const project2 = Projects.insert({
      name: "Keela2 Project",
      owner: currentUser,
      organizationId2,
    });
    Tasks.insert({
      name: "task2",
      projectId: project2,
      organizationId: organizationId2,
    });
  });

  describe("task.list", function () {
    it("sends data when user is logged and projectId and organizationId are specified", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect(
        "tasks.list",
        organizationId,
        projectId,
        (collections) => {
          assert.equal(collections.tasks.length, 1);
          done();
        }
      );
    });
    it("sends data when user is logged and organizationId and projectId are not specified", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("tasks.list", (collections) => {
        assert.equal(collections.tasks.length, 2);
        done();
      });
    });

    it("not send data when user isn't logged", function (done) {
      const collector = new PublicationCollector();
      collector.collect("tasks.list", (collections) => {
        assert.equal(Object.keys(collections), 0);
        done();
      });
    });
  });

  describe("tasks.get", function () {
    it("sends data when user is logged and taskId is specified", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("tasks.get", taskId, (collections) => {
        assert.equal(collections.tasks.length, 1);
        assert.equal(collections.comments.length, 1);
        done();
      });
    });

    it("not send data when taskId isn't provided", function (done) {
      const collector = new PublicationCollector(context);
      collector.collect("tasks.get", (collections) => {
        assert.equal(Object.keys(collections), 0);
        done();
      });
    });

    it("not send data when user isn't logged", function (done) {
      const collector = new PublicationCollector();
      collector.collect("tasks.get", (collections) => {
        assert.equal(Object.keys(collections), 0);
        done();
      });
    });
  });
});
