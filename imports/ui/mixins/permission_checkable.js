export default {
  methods: {
    checkPermissions(policies) {
      return this.$meteor.checkPermissions(
        this.$store.state.organizationId,
        policies
      );
    },
  },
};
