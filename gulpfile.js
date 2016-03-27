const gulp = require('gulp')
const path = require('path')
const webpack = require('webpack')
const nodemon = require('nodemon')
const serverDevConfig = require('./config/webpack.server.dev')
const clientDevConfig = require('./config/webpack.client.dev')

const onBuild = (err, stats) => {
  if (err) {
    console.log('Error: ', err)
  } else {
    console.log(stats.toString({
      chunks: false
    }))
  }
}

gulp.task('watch-server-dev', () => {
  webpack(serverDevConfig).watch(100, onBuild)
})

gulp.task('watch-client-dev', () => {
  webpack(clientDevConfig).watch(100, onBuild)
})

gulp.task('watch', ['watch-server-dev', 'watch-client-dev'])

gulp.task('run-dev', ['watch-server-dev', 'watch-client-dev'], function (a,b,c,d,e) {
  nodemon({
    verbose: true,
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'target/server.js'),
    ignore: ['web/app.js'],
    watch: ['target/'],
    ext: 'js'
  }).on('restart', () => console.log('Server restarted.'))
})
