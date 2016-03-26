const path = require('path')

module.exports = {
  entry: "./src/client/index.js",
  output: {
    path: __dirname,
    filename: "target/app.js"
  },
  devtool: 'eval-cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src/client")
        ],
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
