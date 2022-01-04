<template>
  <div>
    <div v-if="!areSubscriptionsReady"></div>
    <v-tabs
      v-else
      v-model="currentTabIndex"
      color="primary"
      slider-color="primary"
    >
      <v-tab> Projects </v-tab>
      <v-tab> Members </v-tab>
      <v-tab-item>
        <ProjectsTable :items="projects" />
      </v-tab-item>
      <v-tab-item>
        <MembersTable :items="organizationMembers" />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ProjectsTable from "../../components/ProjectsTable.vue";
import MembersTable from "../../components/MembersTable.vue";
import Organizations from "../../../api/collections/Organizations";
import Projects from "../../../api/collections/Projects";
import subscription_ready_emitable from "../../mixins/subscription_ready_emitable";
import Tasks from "../../../api/collections/Tasks";

export default {
  components: { ProjectsTable, MembersTable },
  mixins: [subscription_ready_emitable],
  meteor: {
    $subscribe: {
      "organization.members": function () {
        return [this.organizationId];
      },
      "organization.get": function () {
        return [this.organizationId];
      },
      "projects.list": function () {
        return [this.organizationId];
      },
      "tasks.list": function () {
        return [this.organizationId];
      },
    },
    organizationMembers() {
      if (!this.organization) return [];
      return Meteor.users
        .find(
          {
            _id: {
              $in: [this.organization.owner, ...this.organization.members],
            },
          },
          {
            sort: {
              username: 1,
            },
          }
        )
        .map((x) => {
          const role = x.roles ? x.roles[this.organizationId] : null;
          return { ...x, role };
        });
    },
    organization() {
      return Organizations.findOne({ _id: this.organizationId });
    },
    projects() {
      if (!this.organizationId) return [];
      return Projects.find(
        { organizationId: this.organizationId },
        { sort: { name: 1 } }
      ).map((x) => ({
        ...x,
        taskQty: Tasks.find({ projectId: x._id }).count(),
      }));
    },
  },
  data: () => ({
    currentTabIndex: 0,
  }),
  watch: {
    areSubscriptionsReady() {
      if (this.areSubscriptionsReady) {
        this.$eventBus.$emit("breadcrumbs", [
          { text: "Organizations", to: { name: "organizations.home" } },
          { text: this.organization.name },
        ]);
      }
    },
  },
  computed: {
    ...mapState({
      organizationId: (state) => state.organizationId,
    }),
  },
};
</script>

<style></style>
