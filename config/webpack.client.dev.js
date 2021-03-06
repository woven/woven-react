const path = require('path')

module.exports = {
  entry: "./src/client/index.js",
  output: {
    path: __dirname,
    filename: "../target/web/app.js"
  },
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "../src/client"),
          path.resolve(__dirname, "../src/shared")
        ],
        exclude: [],
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          cacheDirectory: '',
          sourceMap: true
        }
      }
    ]
  }
}
