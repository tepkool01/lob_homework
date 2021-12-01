const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 8080

// CLIENT - Creating route to serve main view
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'))
})
app.use(express.static('public'))

// SERVER (API) - Address route, adhering to https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
const addressHandler = require('./addressHandler')
const simpleSearchService = require('./services/search/simple')
app.use(express.json());
app.route('/addresses')
	.get(addressHandler.findAll(simpleSearchService))
	.post(addressHandler.create)
	.put(addressHandler.update) // allows users to 'erase' parts of address by including whitespace; patch better for editing, could have both too
	.delete(addressHandler.delete)

// Start server by listening on the designated port
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})