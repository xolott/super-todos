<template>
  <OrganizationsTable :items="organizations" />
</template>

<script>
import Organizations from "../../../api/collections/Organizations";
import OrganizationsTable from "../../components/OrganizationsTable.vue";
import subscription_ready_emitable from "../../mixins/subscription_ready_emitable";

export default {
  name: "organizations",
  components: {
    OrganizationsTable,
  },
  mixins: [subscription_ready_emitable],
  meteor: {
    $subscribe: {
      "organizations.list": [],
    },
    organizations() {
      return Organizations.find({}, { sort: { name: 1 } }).map((x) => ({
        ...x,
        memberQty: x.members.length + 1,
        projectQty: x.projects.length,
      }));
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$eventBus.$emit("breadcrumbs", [
        {
          text: "Organizations",
        },
      ]);
    });
  },
};
</script>

<style></style>
