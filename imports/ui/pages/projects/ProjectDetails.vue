<template>
  <div>
    <div v-if="!areSubscriptionsReady"></div>
    <TasksTable v-else :items="tasks" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import Organizations from "../../../api/collections/Organizations";
import Projects from "../../../api/collections/Projects";
import subscription_ready_emitable from "../../mixins/subscription_ready_emitable";
import TasksTable from "../../components/TasksTable.vue";
import Tasks from "../../../api/collections/Tasks";
export default {
  name: "project-details",
  components: { TasksTable },
  mixins: [subscription_ready_emitable],
  meteor: {
    $subscribe: {
      "organization.get": function () {
        return [this.organizationId];
      },
      "project.get": function () {
        return [this.projectId, this.organizationId];
      },
      "tasks.list": function () {
        return [this.organizationId, this.projectId];
      },
    },
    organization() {
      if (this.organizationId)
        return Organizations.findOne({ _id: this.organizationId });
      return null;
    },
    project() {
      if (!this.projectId || !this.organizationId) return {};
      return Projects.findOne({
        _id: this.projectId,
        organizationId: this.organizationId,
      });
    },
    tasks() {
      return Tasks.find({ projectId: this.projectId }, { sort: { name: 1 } });
    },
    user() {
      return Meteor.users.find({});
    },
  },
  data: () => ({
    currentTabIndex: 0,
  }),
  watch: {
    areSubscriptionsReady() {
      if (this.areSubscriptionsReady) {
        if (!this.project) {
          this.$eventBus.$emit("alert", {
            type: "error",
            message: "Unauthorized access. Redirecting to home...",
          });
          this.$router.push({ name: "home" });
        }
        if (this.organizationId) {
          this.$eventBus.$emit("breadcrumbs", [
            { text: "Organizations", to: { name: "organizations.home" } },
            {
              text: this.organization.name,
              to: {
                name: "organizations.details",
                params: { orgId: this.organizationId },
              },
            },
            {
              text: `Project: ${this.project.name}`,
            },
          ]);
        } else {
          this.$eventBus.$emit("breadcrumbs", [
            { text: "Projects", to: { name: "projects.home" } },
            {
              text: this.project.name,
            },
          ]);
        }
      }
    },
  },
  computed: {
    ...mapState({
      organizationId: (state) => state.organizationId,
      projectId: (state) => state.projectId,
    }),
  },
};
</script>

<style></style>
