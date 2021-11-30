const fs = require('fs');

// Reading the JSON file with all the addresses (super basic, no error handling, etc)
let addressesRaw = fs.readFileSync('addresses.json');
let addresses = JSON.parse(addressesRaw);

// getAddresses - retrieves all the addresses based on a search parameter
exports.listAddresses = (req, res) => {
	console.log(">>listAddresses", req.query.searchStr)

	let searchStr = req.query.searchStr

	// Trying simple search first
	let result = addresses.filter(address => {
		let fullAddressStr = Object.values(address).join(' ') // getting full address in 1 str to search it easier
		return fullAddressStr.indexOf(searchStr) !== -1
	})

	res.json(result)
}

exports.createAddress = (req, res) => {

}

exports.deleteAddress = (req, res) => {

}

exports.updateAddress = (req, res) => {

}