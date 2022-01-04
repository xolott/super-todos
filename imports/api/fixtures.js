import { Meteor } from "meteor/meteor";
import Roles from "./collections/Roles";

Meteor.startup(() => {
  if (Roles.find().count() === 0) {
    /*
ownner, manager, coordinator
owner can add/remove users
manager can create tasks
coordinator can comment
owner can also create task + comment on tasks
managers can also comment on tasks
but coordinator can only comment
*/
    Roles.remove({});
    const data = [
      {
        name: "owner",
        policies: [
          "organization.update",
          "organization.delete",
          "project.create",
          "project.update",
          "project.delete",
          "task.create",
          "task.update",
          "task.delete",
          "comment.create",
        ],
      },
      {
        name: "manager",
        policies: [
          "task.create",
          "task.update",
          "task.delete",
          "comment.create",
        ],
      },
      {
        name: "coordinator",
        policies: ["comment.create"],
      },
    ];

    data.forEach((role) => Roles.insert(role));
  }
});
