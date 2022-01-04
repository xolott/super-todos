export default {
  mounted() {
    this.emitIfReady();
  },
  watch: {
    _subscriptionsReady() {
      this.emitIfReady();
    },
  },
  computed: {
    _subscriptionsReady() {
      return Object.values(this.$subReady).every((x) => x);
    },
    areSubscriptionsReady() {
      const values = Object.values(this.$subReady);
      return values.length === 0 || values.every((x) => x);
    },
  },
  methods: {
    emitIfReady() {
      const values = Object.values(this.$subReady);
      if (values.length === 0 || values.every((x) => x))
        this.$eventBus.$emit("subscriptions.ready");
    },
  },
};
