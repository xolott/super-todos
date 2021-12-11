<template>
  <div class="alert">
    <v-slide-x-reverse-transition group>
      <v-alert
        v-for="item in items"
        :key="item.id"
        border="left"
        dismissible
        :type="item.type"
      >
        {{ item.message }}
      </v-alert>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script>
import generateId from "../../utils/id-generator";

export default {
  name: "alert",
  data: () => ({
    items: [],
  }),
  created() {
    this.$eventBus.$on("alert", this.newAlert);
  },
  beforeDestroy() {
    this.$eventBus.$off("alert");
  },
  methods: {
    newAlert(data) {
      data = { ...data, id: generateId(16) };
      this.items = [...this.items, data];
      setTimeout(
        () => (this.items = this.items.filter((x) => x.id !== data.id)),
        3000
      );
    },
  },
};
</script>

<style scoped>
.alert {
  position: absolute;
  z-index: 300;
  right: 1rem;
  top: 1rem;
}
</style>
