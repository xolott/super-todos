import Vue from "vue";

import { router, vuetify, store } from "../imports/ui/plugins";
import "../imports/ui/styles/styles.scss";
import "../imports/api/extensions";
import "../imports/ui/mixins";

import App from "../imports/ui/App.vue";

Meteor.startup(() => {
  new Vue({
    router,
    store,
    vuetify,
    el: "#app",
    ...App,
  });
});
