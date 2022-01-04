import Vue from "vue";
import { Meteor } from "meteor/meteor";

const meteor = {
  install(v) {
    v.prototype.$meteor = Meteor;
  },
};

Vue.use(meteor);
