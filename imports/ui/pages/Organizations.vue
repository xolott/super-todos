<template>
  <v-container fluid>
    <OrganizationsTable />
  </v-container>
</template>

<script>
import OrganizationsTable from "../components/OrganizationsTable.vue";

export default {
  name: "organizations",
  components: {
    OrganizationsTable,
  },
};
</script>

<style></style>
