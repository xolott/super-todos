<template>
  <v-data-table :headers="headers" :items="items">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title> {{ items.length }} Members </v-toolbar-title>
        <v-spacer />
        <AddMemberDialog :edit="edit" v-model="dialog" @onClose="clear" />
        <ConfirmationDialog ref="deleteDialog" />
      </v-toolbar>
    </template>
    <template
      v-if="checkPermissions('organization.update')"
      v-slot:item.actions="{ item }"
    >
      <v-icon
        :disabled="!allowed(item)"
        small
        @click.stop="onDeleteItem(item)"
        color="error"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import ProjectDialog from "./ProjectDialog.vue";
import ConfirmationDialog from "./dialogs/ConfirmationDialog.vue";
import AddMemberDialog from "./dialogs/AddMemberDialog.vue";
import { mapState } from "vuex";

export default {
  name: "members-table",
  components: { ProjectDialog, ConfirmationDialog, AddMemberDialog },
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
      projectId: (state) => state.projectId,
    }),
    headers() {
      const items = [
        {
          text: "Username",
          value: "username",
          width: "initial",
        },
        {
          text: "Role",
          value: "role",
          width: "initial",
        },
      ];
      const actions = {
        text: "Actions",
        value: "actions",
        sortable: false,
        width: 150,
      };
      if (this.checkPermissions("organization.update")) items.push(actions);
      return items;
    },
  },
  watch: {
    organizationId() {
      this.clear();
    },
  },

  methods: {
    allowed(user) {
      const userId = Meteor.userId();
      return this.organization?.owner === userId && user?._id !== userId;
    },
    onEditItem(item) {
      this.editedItem = { ...item };
      this.edit = true;
      this.dialog = true;
    },
    async onDeleteItem(item) {
      if (await this.$refs.deleteDialog.open("Delete Member")) {
        Meteor.call(
          "organization.members.delete",
          this.organization?._id,
          item?._id,
          (error) => {
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
          }
        );
      }
    },
    clear() {
      this.editedItem = { organizationId: this.organizationId };
      this.edit = false;
    },
  },
};
</script>

<style></style>
