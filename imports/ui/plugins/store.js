import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    organizationId: null,
    projectId: null,
    taskId: null,
  },
  mutations: {
    SET_ORGANIZATION_ID(state, value) {
      state.organizationId = value;
    },
    SET_PROJECT_ID(state, value) {
      state.projectId = value;
    },
    SET_TASK_ID(state, value) {
      state.taskId = value;
    },
  },
  actions: {
    setOrganizationId({ commit }, value) {
      commit("SET_ORGANIZATION_ID", value ?? null);
    },
    setProjectId({ commit }, value) {
      commit("SET_PROJECT_ID", value ?? null);
    },
    setTaskId({ commit }, value) {
      commit("SET_TASK_ID", value ?? null);
    },
  },
});
export default store;
