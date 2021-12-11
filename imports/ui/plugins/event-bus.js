import Vue from "vue";

const eventBus = {
  install(v) {
    v.prototype.$eventBus = new Vue();
  },
};

Vue.use(eventBus);
