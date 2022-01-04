<template>
  <v-data-table :headers="headers" :items="items" @click:row="onRowClick">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title> {{ items.length }} Taks </v-toolbar-title>
        <v-spacer />
        <TaskDialog
          v-if="canShowActions"
          :edit="edit"
          v-model="dialog"
          v-bind:data="editedItem"
          @onClose="clear"
        />
        <ConfirmationDialog ref="deleteDialog" />
      </v-toolbar>
    </template>
    <template v-if="canShowActions" v-slot:item.actions="{ item }">
      <v-btn
        icon
        class="mr-2"
        v-if="checkPermissions(['task.update'])"
        @click.stop="onEditItem(item)"
      >
        <v-icon small color="success"> mdi-pencil </v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="onDeleteItem(item)"
        v-if="checkPermissions(['task.delete'])"
      >
        <v-icon small color="error"> mdi-delete </v-icon>
      </v-btn>
    </template>
    <template v-slot:no-data>
      <div class="no-data">
        <h2>Oh no! You have 0 tasks.</h2>
        <h2>What are you waiting? Create one!</h2>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import ProjectDialog from "./ProjectDialog.vue";
import ConfirmationDialog from "./dialogs/ConfirmationDialog.vue";
import TaskDialog from "./TaskDialog.vue";
import { mapState } from "vuex";

export default {
  name: "tasks-table",
  components: { ProjectDialog, ConfirmationDialog, TaskDialog },
  props: {
    items: { type: Array, required: true },
  },

  data: () => ({
    dialog: false,
    editedItem: {},
    edit: false,
  }),
  mounted() {
    this.clear();
  },
  computed: {
    ...mapState({
      organizationId: (state) => state.organizationId,
    }),
    headers() {
      const items = [
        {
          text: "Name",
          value: "name",
          width: "initial",
        },
        {
          text: "Description",
          value: "description",
          width: "initial",
        },
      ];
      if (this.canShowActions) {
        items.push({
          text: "Actions",
          value: "actions",
          sortable: false,
          width: 150,
        });
      }
      return items;
    },
    canShowActions() {
      return (
        this.checkPermissions("task.update") ||
        this.checkPermissions("task.delete")
      );
    },
  },
  methods: {
    onEditItem(item) {
      this.editedItem = { ...item };
      this.edit = true;
      this.dialog = true;
    },
    async onDeleteItem(item) {
      if (await this.$refs.deleteDialog.open("Delete Task")) {
        Meteor.call("task.delete", item._id, (error) => {
          if (error) {
            this.$eventBus.$emit("alert", {
              type: "error",
              message: error.reason,
            });
          } else {
            this.$eventBus.$emit("alert", {
              type: "success",
              message: "Deleted",
            });
            this.clear();
          }
        });
      }
    },
    clear() {
      this.editedItem = { organizationId: this.organizationId };
      this.edit = false;
    },
    onRowClick(item) {
      this.$router.push({
        path: `/organizations/${item.organizationId}/project/${item.projectId}/task/${item._id}`,
      });
    },
  },
};
</script>

<style scoped>
.no-data {
  margin: 1rem;
}
</style>
