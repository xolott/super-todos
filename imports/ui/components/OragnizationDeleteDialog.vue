<template>
  <v-dialog v-model="show" max-width="500px" @click:outside="clear">
    <v-card>
      <v-card-title class="text-h5 align-center"
        >Delete Organization</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="clear">Cancel</v-btn>
        <v-btn color="primary" @click="confirm">OK</v-btn>
        <v-spacer></v-spacer>
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
  },
  methods: {
    clear() {
      this.show = false;
    },
    confirm() {
      Meteor.call("organization.delete", this.data, (error) => {
        if (error) {
          this.$eventBus.$emit("alert", {
            type: "error",
            message: error.reason,
          });
        } else {
          this.clear();
        }
      });
    },
  },
};
</script>

<style></style>
