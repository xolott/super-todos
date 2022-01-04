<template>
  <v-dialog v-model="show" max-width="500px" @click:outside="clear">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="checkPermissions('organization.update')"
        color="primary"
        v-bind="attrs"
        v-on="on"
        >Add Member
      </v-btn>
    </template>
    <v-card>
      <v-card-title>New Member</v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="flex-column">
            <v-col>
              <v-select
                :items="nonMembers"
                v-model="userId"
                item-value="_id"
                item-text="username"
                label="User"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                :items="roles"
                v-model="role"
                item-value="name"
                item-text="name"
                label="Role"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="clear">Cancel</v-btn>
        <v-btn color="primary" :disabled="userId === null" @click="onSave"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { Meteor } from "meteor/meteor";
import Organizations from "../../../api/collections/Organizations";
import Roles from "../../../api/collections/Roles";
export default {
  props: {
    value: { type: Boolean },
  },
  data: () => ({ userId: null, role: null }),
  meteor: {
    $subscribe: {
      "organization.nonMembers": function () {
        return [this.organizationId];
      },
    },
    nonMembers() {
      const org = Organizations.findOne({ _id: this.organizationId });
      if (!org) return [];
      return Meteor.users.find(
        { _id: { $nin: [org.owner, ...org.members] } },
        { sort: { username: 1 } }
      );
    },
    roles() {
      return Roles.find({});
    },
  },
  computed: {
    ...mapState({
      organizationId: (state) => state.organizationId,
    }),
    items() {
      return this.nonMembers;
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    clear() {
      this.$emit("onClose");
      this.userId = null;
      this.role = null;
      this.show = false;
    },
    onSave() {
      if (this.userId && this.role) {
        Meteor.call(
          "organization.members.add",
          this.organizationId,
          this.userId,
          this.role,
          (error) => {
            if (error) {
              this.$eventBus.$emit("alert", {
                type: "error",
                message: error.reason,
              });
            } else {
              this.$eventBus.$emit("alert", {
                type: "success",
                message: "Added",
              });
              this.clear();
            }
          }
        );
      }
    },
  },
};
</script>

<style></style>
