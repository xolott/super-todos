import EmptyRouterView from "../../components/EmptyRouterView.vue";
import Login from "../../pages/accounts/Login.vue";
import Signup from "../../pages/accounts/Signup.vue";
import Home from "../../pages/Home.vue";
import OrganizationsHome from "../../pages/organizations/OrganizationsHome.vue";
import OrganizationDetails from "../../pages/organizations/OrganizationDetails.vue";
import ProjectDetails from "../../pages/projects/ProjectDetails.vue";
import TaskDetails from "../../pages/tasks/TaskDetails.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    path: "/organizations",
    component: EmptyRouterView,
    children: [
      {
        name: "organizations.home",
        path: "",
        component: OrganizationsHome,
      },
      {
        path: ":orgId/",
        component: EmptyRouterView,
        children: [
          {
            name: "organizations.details",
            path: "",
            component: OrganizationDetails,
          },
          {
            path: "project/:projectId",
            component: EmptyRouterView,
            children: [
              {
                name: "organizations.project.details",
                path: "",
                component: ProjectDetails,
              },
              {
                name: "organizations.project.task.details",
                path: "task/:taskId",
                component: TaskDetails,
              },
            ],
          },
        ],
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
  // {
  //   name: "catchAll",
  //   path: "*",
  //   redirect: {
  //     name: "home",
  //   },
  // },
];

export default routes;
