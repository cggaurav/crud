const express = require('express')
const config = require('config')
const bodyParser = require('body-parser')
const app = express()
const port = config.api.port || 8081

app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.json({ service: 'API'})
})

const routes = require('./routes')

app.use('/books', routes.books)

const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

module.exports = sever

