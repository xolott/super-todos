<template>
  <v-container fluid> </v-container>
</template>

<script>
export default {
  name: "home",
  mounted() {
    this.$router.replace({ name: "organizations" });
  },
};
</script>

<style></style>
