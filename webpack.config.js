const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const browserConfig = {
  entry: "./src/browser/index.js",
  output: {
    path: __dirname,
    filename: "./public/bundle.js"
  },
  module: {
    rules: [
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.tff$/],
        loader: "file-loader",
        options: {
          name: "public/media/[name].[ext]",
          publicPath: url => url.replace(/public/, "")
        }
      },
      {
        test: /\.css|.less$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
              options: { importLoaders: 1 }
            },
            {
              loader: "postcss-loader",
              options: { plugins: [autoprefixer()] }
            },
            {
              loader: "less-loader", options: {
                javascriptEnabled: true
              }
            }
          ]
        })
      },
      {
        test: /js?/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [
            "react",
            "stage-0"
          ],
          plugins: ["transform-decorators-legacy", ["import", { "libraryName": "antd", "style": true }]]
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "public/css/[name].css",
      allChunks: true
    })
  ]
};

const serverConfig = {
  entry: "./src/server/index.js",
  target: "node",
  output: {
    path: __dirname,
    filename: "server.js",
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.tff$/],
        loader: "file-loader",
        options: {
          name: "public/media/[name].[ext]",
          publicPath: url => url.replace(/public/, ""),
          emit: false
        }
      },
      {
        test: /\.css|.less$/,
        use: [
          {
            loader: "css-loader/locals"
          },
          {
            loader: "less-loader", options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /js?/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [
            "react",
            "stage-0"
          ],
          plugins: ["transform-decorators-legacy", ["import", { "libraryName": "antd", "style": true }]]
        }
      }
    ]
  }
};

module.exports = [browserConfig, serverConfig];