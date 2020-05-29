const bodyParser = require('body-parser')
const express = require('express')
const { getNumbers, saveNumber, updateNumber } = require('./controllers/numbers')

const app = express()

app.get('/', getNumbers)
app.post('/', bodyParser.json(), saveNumber)
app.put('/', bodyParser.json(), updateNumber)

app.listen(1337, () => {
  console.log('Listening on port 1337...') // eslint-disable-line no-console
})
