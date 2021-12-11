<template>
  <v-app>
    <v-app-bar app class="primary" v-if="!$route.meta.hideLayout">
      <v-toolbar-title class="white--text fw-700">Super TODOs</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon color="white">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
      <alert />
    </v-main>
  </v-app>
</template>

<script>
import Alert from "./components/Alert.vue";

export default {
  components: {
    Alert,
  },
  methods: {
    logout() {
      Meteor.logout((error) => {
        if (error) {
          this.$eventBus.$emit("alert", {
            type: "error",
            message: error.reason,
          });
        } else {
          this.$router.push({ name: "auth.login" });
        }
      });
    },
  },
};
</script>

<style scoped></style>
