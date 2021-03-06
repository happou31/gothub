const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";
const isLocal = !!process.env.LOCAL;

const outputPath = isDev ? path.join(__dirname, isLocal ? "local" : "debug") : path.join(__dirname, "extension");

const plugins = [
  new CopyWebpackPlugin([{
      from: path.join(__dirname, "assets/manifest.json"),
    },
    {
      from: path.join(__dirname, "assets/popup.html")
    },
    {
      from: path.join(__dirname, "assets/page.html")
    }
  ])
];

module.exports = {
  entry: {
    script: path.join(__dirname, "./src/index.tsx"),
  },
  devtool: isDev ? "source-map" : false,
  watch: isDev,
  resolve: {
    extensions: [
      ".ts", ".tsx", ".js", ".svg"
    ]
  },
  output: {
    filename: "[name].js",
    path: outputPath
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: {
        loader: "ts-loader",
        options: {
          transpileOnly: !isDev
        }
      },
    }, {
      test: /\.svg$/,
      use: {
        loader: "react-svg-loader"
      }
    }]
  },
  plugins
};

if (isDev && process.env.LOCAL) {
  const servePort = 8081;
  const chokidar = require("chokidar");
  const WebSocket = require('ws')
  module.exports.mode = "development";
  module.exports.serve = {
    content: [path.resolve(__dirname, "./popup.html")],

    config: {},
    hot: {
      host: "localhost",
      port: servePort,
    },
    on: {
      "listening": () => {
        console.log("listening");
        const socket = new WebSocket(`ws://localhost:${servePort}`);
        const watchPath = __dirname;
        const options = {};
        const watcher = chokidar.watch(watchPath, options);
        watcher.on("change", () => {
          const data = {
            type: "broadcast",
            data: {
              type: "windreload",
              data: {},
            },
          };

          socket.send(JSON.stringify(data));
        });
      }
    },
    open: true,
  }
}