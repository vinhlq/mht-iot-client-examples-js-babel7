const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    register: "./user-register.js"
  },
  target: "node",

  output: {
    path: __dirname + "/dist1",
    filename: '[name].js'
  },

  // Since aws-sdk is not compatible with webpack, we exclude all node dependencies
  externals: [nodeExternals()],

  // Run babel on all .js files and skip those in node_modules
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: __dirname,
        exclude: /node_modules/
      }
    ],
  }
};
