<template>
  <v-app>
    <v-app-bar
      app
      class="primary"
      v-if="!$route.meta.hideLayout && currentUser"
    >
      <v-toolbar-title class="white--text fw-700">Super TODOs</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-avatar class="user-avatar">
        <v-img :src="`https://i.pravatar.cc/300?u=${currentUser._id}`"></v-img>
      </v-avatar>
      <span class="user-username fw-700">
        {{ currentUser.username }}
      </span>
      <v-btn icon @click="logout">
        <v-icon color="white">mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view v-if="$route.meta.hideLayout"></router-view>
      <v-container fluid v-else>
        <breadcrumbs />
        <router-view></router-view>
      </v-container>
      <alert />
    </v-main>
  </v-app>
</template>

<script>
import { Meteor } from "meteor/meteor";
import Alert from "./components/Alert.vue";
import Breadcrumbs from "./components/Breadcrumbs.vue";

export default {
  components: {
    Alert,
    Breadcrumbs,
  },
  meteor: {
    currentUser() {
      return Meteor.user();
    },
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

<style scoped lang="scss">
.user-avatar {
  margin: 0 0.5rem;
}
.user-username {
  margin-right: 1rem;
  font-size: 1.5rem;
  color: white;
}
</style>
