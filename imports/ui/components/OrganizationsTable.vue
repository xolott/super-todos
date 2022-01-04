<template>
  <v-data-table :headers="headers" :items="items" @click:row="onRowClick">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title> {{ items.length }} Organizations </v-toolbar-title>
        <v-spacer />
        <OragnizationDialog
          :edit="edit"
          v-model="dialog"
          v-bind:data="editedItem"
          @onClose="clear"
        />
        <ConfirmationDialog ref="deleteDialog" />
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        :disabled="!allowed(item)"
        small
        class="mr-2"
        @click.stop="onEditItem(item)"
        color="success"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        :disabled="!allowed(item)"
        small
        @click.stop="onDeleteItem(item)"
        color="error"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <div class="no-data">
        <h2>Oh no! You are a member of 0 organizations.</h2>
        <h2>What are you waiting? Create one!</h2>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import OragnizationDialog from "./OragnizationDialog.vue";
import ConfirmationDialog from "./dialogs/ConfirmationDialog.vue";

export default {
  name: "organizations-table",
  components: {
    OragnizationDialog,
    ConfirmationDialog,
  },
  props: {
    items: { type: Array, required: true },
  },
  data: () => ({
    dialog: false,
    editedItem: {},
    edit: false,

    headers: [
      {
        text: "Name",
        value: "name",
        width: "initial",
      },
      {
        text: "Members",
        value: "memberQty",
        width: 150,
      },
      {
        text: "Projects",
        value: "projectQty",
        width: 150,
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: 150,
      },
    ],
  }),
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
      if (await this.$refs.deleteDialog.open("Delete Organization")) {
        Meteor.call("organization.delete", item._id, (error) => {
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
      this.editedItem = {};
      this.edit = false;
    },
    onRowClick(item) {
      this.$router.push({ path: `/organizations/${item._id}/` });
    },
  },
};
</script>

<style scoped>
.no-data {
  margin: 1rem;
}
</style>
