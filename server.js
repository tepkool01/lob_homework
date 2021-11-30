const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 8080

// CLIENT - Creating route to serve main view, which includes the base library for VueJS
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/vue.js', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/lib/vue-2.6.11.js'))
})
app.get('/axios.js', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/lib/axios-0.24.0.js'))
})

// SERVER (API) - Address route below with
const addressHandler = require('./addressHandler');
app.route('/addresses')
	.get(addressHandler.listAddresses)
	.post(addressHandler.createAddress)
	.patch(addressHandler.updateAddress)
	.delete(addressHandler.deleteAddress)

// Start server by listening on the designated port
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`)
})