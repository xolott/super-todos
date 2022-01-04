<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    @click:outside="cancel"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title class="text-h5 align-center">{{ message }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="cancel">Cancel</v-btn>
        <v-btn color="primary" @click="confirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    message: "",
    resolve: null,
    reject: null,
  }),
  methods: {
    open(message) {
      this.message = message;
      this.dialog = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
