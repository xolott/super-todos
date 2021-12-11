import Vue from "vue";

import { router, vuetify } from "../imports/ui/plugins";
import "../imports/ui/styles/styles.scss";

import App from "../imports/ui/App.vue";

Meteor.startup(() => {
  new Vue({
    router,
    vuetify,
    el: "#app",
    ...App,
  });
});
