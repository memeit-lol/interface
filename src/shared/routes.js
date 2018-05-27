import Layout from "./components/Layout";
import Feed from "./components/Feed";
import Callback from "./components/Callback";
import Single from "./components/Single";

import axios from 'axios';
import config from './config';

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
        component: Single,
        loadData: async (match) => {
          return await axios.get(config.api + `info?type=post&author=${match.params.author}&permlink=${match.params.permlink}`)
        }
      }
    ]
  }
];

export default routes;