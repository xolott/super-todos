<template>
  <v-dialog v-model="show" max-width="500px" @click:outside="clear">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">New Organization </v-btn>
    </template>
    <v-card>
      <v-card-title>{{ formTitle }} Organization</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="data.name" label="Name"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="clear">Cancel</v-btn>
        <v-btn color="primary" @click="onSave">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Meteor } from "meteor/meteor";
export default {
  props: {
    value: { type: Boolean },
    data: { type: Object },
    edit: { type: Boolean, default: false },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    formTitle() {
      return this.edit ? "Edit" : "New";
    },
  },
  methods: {
    clear() {
      this.$emit("onClose");
      this.show = false;
    },
    onSave() {
      if (!this.edit) {
        Meteor.call("organization.create", this.data.name, (error) => {
          if (error) {
            this.$eventBus.$emit("alert", {
              type: "error",
              message: error.reason,
            });
          } else {
            this.$eventBus.$emit("alert", {
              type: "success",
              message: "Created",
            });
            this.clear();
          }
        });
      } else {
        Meteor.call("organization.update", this.data, (error) => {
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
        });
      }
    },
  },
};
</script>

<style></style>
