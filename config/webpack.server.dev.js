const path = require('path')
const fs = require('fs')

const nodeModules = {}
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = {
  entry: "./src/server/index.js",
  target: "node",
  output: {
    path: __dirname,
    filename: "../target/server.js"
  },
  devtool: 'eval-cheap-module-source-map',
  externals: nodeModules,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, "../src/server"),
          path.resolve(__dirname, "../src/shared")
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
