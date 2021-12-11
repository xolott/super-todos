import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({ routes });
const shouldRedirectToLogin = (targetRouter) => {
  return (
    !["auth.login", "auth.signup"].includes(targetRouter) && !Meteor.userId()
  );
};
const shouldRedirectToHome = (targetRouter) => {
  return (
    ["auth.login", "auth.signup"].includes(targetRouter) && Meteor.userId()
  );
};
router.beforeEach((to, from, next) => {
  if (shouldRedirectToLogin(to.name)) {
    next({ name: "auth.login" });
  } else if (shouldRedirectToHome(to.name)) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
