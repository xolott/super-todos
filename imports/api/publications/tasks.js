import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import Organizations from "../collections/Organizations";
import Tasks from "../collections/Tasks";
import Comments from "../collections/Comments";

publishComposite("tasks.list", function (orgId = null, projectId = null) {
  if (!this.userId) {
    return this.ready();
  }
  check(projectId, Match.Maybe(String));
  check(orgId, Match.Maybe(String));

  return {
    find() {
      const selector = {
        ...(orgId ? { _id: orgId } : {}),
        $or: [
          { owner: this.userId },
          { members: { $elemMatch: { $eq: this.userId } } },
        ],
      };
      return Organizations.find(selector);
    },
    children: [
      {
        find(org) {
          const selector = {
            ...(projectId ? { projectId: projectId } : {}),
            organizationId: org._id,
          };
          return Tasks.find(selector);
        },
      },
    ],
  };
});

publishComposite("tasks.get", function (taskId) {
  if (!this.userId || !taskId) {
    return this.ready();
  }
  check(taskId, String);

  return {
    find() {
      const selector = {
        $or: [
          { owner: this.userId },
          { members: { $elemMatch: { $eq: this.userId } } },
        ],
      };
      return Organizations.find(selector);
    },
    children: [
      {
        find(org) {
          const selector = {
            _id: taskId,
            organizationId: org._id,
          };
          return Tasks.find(selector);
        },
        children: [
          {
            find(task) {
              return Comments.find({ taskId: task._id });
            },
            children: [
              {
                find(comment) {
                  return Meteor.users.find(
                    { _id: comment.userId },
                    {
                      fields: {
                        username: 1,
                      },
                    }
                  );
                },
              },
            ],
          },
        ],
      },
    ],
  };
});
