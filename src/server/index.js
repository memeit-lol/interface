import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { renderRoutes, matchRoutes } from 'react-router-config';
import { StaticRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import routes from "../shared/routes";
import store from "../shared/store";
import { CookiesProvider } from 'react-cookie';
const cookiesMiddleware = require('universal-cookie-express');
import { Helmet } from "react-helmet";

const app = express();

app.use(express.static("public"));
app.use(cookiesMiddleware());

app.get("*", (req, res) => {

  const branch = matchRoutes(routes, req.url);
  const promises = branch.map(({ route, match }) => {
    const fetchData = route.component.fetchData;
    if (fetchData instanceof Function) {
      return fetchData({match});
    }
    return Promise.resolve(null);
  });

  Promise.all(promises).then(() => {
    const context = {};
    const markup = renderToString(
      <Provider store={store}>
        <CookiesProvider cookies={req.universalCookies}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </CookiesProvider>
      </Provider>
    );
    const helmet = Helmet.renderStatic();
    res.send(`
      <!DOCTYPE html>
      <html ${helmet.htmlAttributes.toString()}>
        <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          <meta property="og:locale" content="en_US" />
          <meta property="og:site_name" content="MemeIt.LOL" />
          <meta property="og:description" content="MemeIt.LOL - We go to Memefinity and Beyond" />
          <meta property="twitter:description" content="MemeIt.LOL - We go to Memefinity and Beyond" />
          <meta property="twitter:site" content="MemeIt.LOL" />
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="/css/main.css" />
        </head>
        <body ${helmet.bodyAttributes.toString()}>
          <div id="app">${markup}</div>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `);
  })
});

app.listen(8000, function() {
  console.log("Listening on port 8000.");
});