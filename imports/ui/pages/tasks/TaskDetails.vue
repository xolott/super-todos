<template>
  <div>
    <template v-if="!task"></template>
    <template v-else>
      <h1>{{ task.name }}</h1>
      <p>
        {{ task.description }}
      </p>
      <v-card elevation="0">
        <v-card-title>Comments</v-card-title>
        <v-row
          align="start"
          class="pa-4"
          v-if="checkPermissions('comment.create')"
        >
          <v-col cols="auto">
            <v-avatar>
              <v-img :src="`https://i.pravatar.cc/300?u=${currentUser._id}`">
              </v-img>
            </v-avatar>
          </v-col>
          <v-col>
            <v-textarea
              v-model="commentText"
              auto-grow
              rows="1"
              @keydown.enter.shift.exact.prevent="sendComment"
            />
          </v-col>
          <v-col cols="auto">
            <v-btn icon :disabled="!commentText" @click="sendComment">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-list three-line>
          <v-list-item v-for="item in comments" :key="item._id">
            <v-list-item-avatar size="64">
              <v-img :src="`https://i.pravatar.cc/300?u=${item.user._id}`" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span class="list-item-title fw-700">
                  {{ item.user.username }}
                  <span class="created-date">
                    {{ item.createdAt | date("yyyy-MM-dd hh:mm:ss") }}
                  </span>
                </span>
              </v-list-item-title>
              <v-list-item-subtitle
                v-html="item.content"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Comments from "../../../api/collections/Comments";
import Organizations from "../../../api/collections/Organizations";
import Projects from "../../../api/collections/Projects";
import Tasks from "../../../api/collections/Tasks";
import subscription_ready_emitable from "../../mixins/subscription_ready_emitable";

export default {
  name: "task-details",
  mixins: [subscription_ready_emitable],
  meteor: {
    $subscribe: {
      "organization.get": function () {
        return [this.organizationId];
      },
      "project.get": function () {
        return [this.projectId, this.organizationId];
      },
      "tasks.get": function () {
        return [this.taskId];
      },
    },
    task() {
      return Tasks.findOne({
        _id: this.taskId,
        projectId: this.projectId,
        organizationId: this.organizationId,
      });
    },
    comments() {
      return Comments.find(
        {
          taskId: this.taskId,
        },
        { sort: { createdAt: -1 } }
      ).map((x) => ({
        ...x,
        user: Meteor.users.findOne({ _id: x.userId }),
      }));
    },
    organization() {
      if (!this.organizationId) return null;
      return Organizations.findOne({ _id: this.organizationId });
    },
    project() {
      if (!this.projectId || !this.organizationId) return null;
      return Projects.findOne({
        _id: this.projectId,
        organizationId: this.organizationId,
      });
    },
    currentUser() {
      return Meteor.user();
    },
  },
  data: () => ({
    commentText: null,
  }),
  created() {
    if (!this.taskId) this.$router.push({ name: "home" });
  },
  computed: {
    ...mapState({
      organizationId: (state) => state.organizationId,
      projectId: (state) => state.projectId,
      taskId: (state) => state.taskId,
    }),
  },
  watch: {
    areSubscriptionsReady() {
      if (this.areSubscriptionsReady) {
        if (!this.task) {
          this.$eventBus.$emit("alert", {
            type: "error",
            message: "Unauthorized access. Redirecting to home...",
          });
          // this.$router.push({ name: "home" });
        } else {
          this.$eventBus.$emit("breadcrumbs", [
            { text: "Organizations", to: { name: "organizations.home" } },
            {
              text: this.organization?.name ?? "No name",
              to: {
                name: "organizations.details",
                params: { orgId: this.organizationId },
              },
            },
            {
              text: `Project: ${this.project?.name ?? "No name"}`,
              to: {
                name: "organizations.project.details",
                params: {
                  orgId: this.organizationId,
                  projectId: this.projectId,
                },
              },
            },
            {
              text: `Task: ${this.task?.name ?? "No name"}`,
            },
          ]);
        }
      }
    },
  },
  methods: {
    sendComment() {
      if (this.commentText && this.commentText.length > 0) {
        Meteor.call(
          "comment.create",
          this.commentText,
          this.taskId,
          (error) => {
            if (error) {
              this.$eventBus.$emit("alert", {
                type: "error",
                message: error.reason,
              });
            } else {
              this.$eventBus.$emit("alert", {
                type: "success",
                message: "Saved",
              });
              this.clear();
            }
          }
        );
      }
    },
    clear() {
      this.commentText = null;
    },
  },
};
</script>

<style lang="scss">
.list-item-title {
  font-size: 1.25rem;
  .created-date {
    font-size: 0.9rem;
    color: #6e6b6b;
    margin-left: 1rem;
  }
}
</style>
