const express = require('express')
const app = express()
const port = process.env.PORT || 8080

// CLIENT - Creating route to serve main view
app.get('/', function (req, res) {
	res.sendFile(`${__dirname}/index.html`)
})
app.use(express.static('public')) // serve up the entire public folder's files to be get-able; front-end libraries use this

// SERVER (API) - Address route, getting our handler/controller to fulfill the requests from the client
const addressHandler = require('./addressHandler')
const simpleSearchService = require('./services/search/simple')
app.use(express.json());
app.route('/addresses')
	.get(addressHandler.findAll(simpleSearchService))
	.post(addressHandler.create)

// Address routes with identifier passed via path parameters
app.route('/addresses/:addressID')
	.put(addressHandler.update) // allows users to 'erase' parts of address by including whitespace; patch better for editing, could have both too
	.delete(addressHandler.delete)

// Start server by listening on the designated port
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})