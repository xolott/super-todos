<template>
  <v-breadcrumbs :items="items">
    <template v-slot:item="{ item }">
      <v-breadcrumbs-item
        :to="item.to"
        class="text-subtitle-2"
        :disabled="item.disabled"
        exact
      >
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: "breadcrumbs",
  data: () => ({ items: [] }),
  created() {
    this.$eventBus.$on("breadcrumbs", this.setBreadcrumbs);
  },
  beforeDestroy() {},
  methods: {
    setBreadcrumbs(items) {
      this.items = items;
    },
  },
};
</script>

<style></style>
