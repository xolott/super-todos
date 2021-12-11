import { Meteor } from "meteor/meteor";
import Organizations from "../collections/Organizations";

Meteor.publish("organizations", function () {
  return Organizations.find();
});
