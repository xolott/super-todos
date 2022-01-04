<template>
  <v-data-table :headers="headers" :items="items" @click:row="onRowClick">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title> {{ items.length }} Projects </v-toolbar-title>
        <v-spacer />
        <ProjectDialog
          :edit="edit"
          v-model="dialog"
          v-bind:data="editedItem"
          @onClose="clear"
        />
        <ConfirmationDialog ref="deleteDialog" />
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn icon :disabled="!allowed(item)" @click.stop="onEditItem(item)">
        <v-icon small class="mr-2" color="success"> mdi-pencil </v-icon>
      </v-btn>
      <v-btn icon :disabled="!allowed(item)" @click.stop="onDeleteItem(item)">
        <v-icon small color="error"> mdi-delete </v-icon>
      </v-btn>
    </template>
    <template v-slot:no-data>
      <div class="no-data">
        <h2>Oh no! You have 0 projects.</h2>
        <h2>What are you waiting? Create one!</h2>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import ProjectDialog from "./ProjectDialog.vue";
import ConfirmationDialog from "./dialogs/ConfirmationDialog.vue";
import { mapState } from "vuex";

export default {
  name: "projects-table",
  components: { ProjectDialog, ConfirmationDialog },
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
  watch: {
    organizationId() {
      this.clear();
    },
  },
  computed: {
    ...mapState({ organizationId: (state) => state.organizationId }),
    headers() {
      const items = [
        {
          text: "Name",
          value: "name",
          width: "initial",
        },
        {
          text: "Tasks",
          value: "taskQty",
          width: 150,
        },
      ];
      const actions = {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: 150,
      };
      if (this.checkPermissions("project.update")) items.push(actions);
      return items;
    },
  },
  methods: {
    allowed(item) {
      return item.owner === Meteor.userId();
    },
    onEditItem(item) {
      this.editedItem = { ...item };
      this.edit = true;
      this.dialog = true;
    },
    async onDeleteItem(item) {
      if (await this.$refs.deleteDialog.open("Delete Project")) {
        Meteor.call("project.delete", item._id, (error) => {
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
      if (this.organizationId === null)
        this.$router.push({ path: `/projects/${item._id}` });
      this.$router.push({
        path: `/organizations/${this.organizationId}/project/${item._id}`,
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
