import Layout from "./components/Layout";
import Feed from "./components/Feed";
import Callback from "./components/Callback";
import Single from "./components/Single";

const routes = [
  {
    component: Layout,
    routes: [
      {
        path: "/",
        exact: true,
        component: Feed
      },
      {
        path: "/callback",
        exact: true,
        component: Callback
      },
      {
        path: "/@:author/:permlink",
        component: Single
      }
    ]
  }
];

export default routes;