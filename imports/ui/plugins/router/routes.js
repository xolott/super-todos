import EmptyRouterView from "../../components/EmptyRouterView.vue";
import Login from "../../pages/accounts/Login.vue";
import Signup from "../../pages/accounts/Signup.vue";
import Home from "../../pages/Home.vue";
import Organizations from "../../pages/Organizations.vue";
import Project from "../../pages/Project.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "organizations",
    path: "/organizations",
    component: EmptyRouterView,
    children: [
      { path: "/", component: Organizations },
      {
        path: ":orgId/projects",
        component: Project,
      },
    ],
  },
  {
    name: "auth.login",
    path: "/login",
    component: Login,
    meta: {
      hideLayout: true,
    },
  },
  {
    name: "auth.signup",
    path: "/signup",
    component: Signup,
    meta: {
      hideLayout: true,
    },
  },
];

export default routes;
