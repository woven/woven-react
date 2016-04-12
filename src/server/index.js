import express from 'express'
import fs from 'fs'
import * as rxdom from 'rx-dom'
import * as rxextra from './../shared/util/rx-overrides'
import {renderToString} from 'react-dom/server'
import AppComponent from './component/app'

const app = express()

const staticOptions = {
  index: false,
  setHeaders: res => {
    res.setHeader('Cache-Control', 'public, max-age=31557600')
  }
}

app.use('/', express.static('target/web', staticOptions))
app.use('/', express.static('static', staticOptions))

app.use((req, res) => {
  AppComponent().first().subscribe(vdom => {
    const appHtml = renderToString(vdom)
    fs.readFile('static/index.html', (err, html) => {
      if (err) { throw err }

      const htmlWithApp = html.toString().replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)
      res.send(htmlWithApp)
      res.end()
    })
  })
})

app.listen(8080, '0.0.0.0', () => {
  console.log('The server is up and running. ')
})
