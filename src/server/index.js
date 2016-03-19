const express = require('express')

const app = express()

app.use('/', express.static('target'))

app.use('/todos', (req, res) => {
  const todos = [
    {id: 1, message: 'hello', checked: false},
    {id: 2, message: 'hello 2', checked: true}
  ]
  res.send(JSON.stringify(todos))
  res.end()
})

app.listen(8080, '0.0.0.0', () => {
  console.log('up and running')
})
