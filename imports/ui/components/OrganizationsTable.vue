<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="organizations"
      @click:row="onRowClick"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            {{ organizations.length }} Organizations
          </v-toolbar-title>
          <v-spacer />
          <OragnizationDialog
            :edit="edit"
            v-model="dialog"
            v-bind:data="editedItem"
            @onClose="clear"
          />
          <OragnizationDeleteDialog
            v-model="dialogDelete"
            v-bind:data="editedItem"
          />
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          :disabled="!allowed(item)"
          small
          class="mr-2"
          @click="onEditItem(item)"
          color="success"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          :disabled="!allowed(item)"
          small
          @click="onDeleteItem(item)"
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
  </div>
</template>

<script>
import Organizations from "../../api/collections/Organizations";
import OragnizationDialog from "./OragnizationDialog.vue";
import OragnizationDeleteDialog from "./OragnizationDeleteDialog.vue";

export default {
  name: "organizations",
  components: { OragnizationDialog, OragnizationDeleteDialog },
  meteor: {
    $subscribe: {
      organizations: [],
    },
    organizations() {
      return Organizations.find({}).map((x) => ({
        ...x,
        memberQty: x.members.length + 1,
        projectQty: x.projects.length,
      }));
    },
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
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
    onDeleteItem(item) {
      this.editedItem = { ...item };
      this.edit = false;
      this.dialogDelete = true;
    },
    clear() {
      this.editedItem = {};
      this.edit = false;
    },
    onRowClick(item) {
      console.log({ item });
      this.$router.push({ path: `/organizations/${item._id}/projects` });
    },
  },
};
</script>

<style scoped>
.no-data {
  margin: 1rem;
}
</style>
