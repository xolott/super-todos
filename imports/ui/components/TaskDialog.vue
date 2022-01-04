<template>
  <v-dialog v-model="show" max-width="500px" @click:outside="clear">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="checkPermissions('task.create')"
        color="primary"
        v-bind="attrs"
        v-on="on"
        >New Task
      </v-btn>
    </template>
    <v-card>
      <v-card-title>{{ formTitle }} Task</v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="flex-column">
            <v-col>
              <v-text-field v-model="data.name" label="Name"></v-text-field>
            </v-col>
            <v-col>
              <v-textarea
                v-model="data.description"
                label="Description"
              ></v-textarea>
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
import { mapState } from "vuex";
export default {
  props: {
    value: { type: Boolean },
    data: { type: Object },
    edit: { type: Boolean, default: false },
  },
  computed: {
    ...mapState({
      organizationId: (state) => state.organizationId,
      projectId: (state) => state.projectId,
    }),
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
        Meteor.call(
          "task.create",
          this.data.name,
          this.data.description,
          this.projectId,
          (error) => {
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
          }
        );
      } else {
        Meteor.call("task.update", this.data, this.projectId, (error) => {
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
