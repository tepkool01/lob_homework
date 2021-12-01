const { v4: uuidv4 } = require('uuid')
const AddressBookModel = require('./models/AddressBook')
const addressBook = new AddressBookModel()

/**
 * Retrieves all the addresses based on a search parameter; uses function composition for dependency injection
 * Search services can be swapped out for one another in the caller of this function
 * @param searchService
 * @returns {(function(*, *): void)|*}
 */
exports.findAll = (searchService) => {
	return function (req, res) {
		console.debug(">>findAll", req.query.searchStr)

		let addresses = addressBook.getAddresses()
		if (req.query.hasOwnProperty('searchStr')) {
			addresses = searchService.findMatches(req.query.searchStr, addresses)
		}
		res.status(200).json(addresses)
	}
}

/**
 * The create function handles the logic for creating a new address and adding it to the address book
 * All checks, sanitization, parsing, etc should be called here
 * @param req - The request object from express (payloads, params, query strings, headers, etc)
 * @param res - The response object from express (sends responses to the view/client)
 * @returns {*}
 */
exports.create = (req, res) => {
	console.debug(">>create", req.body)

	// Checking for duplicate entries, if found, exit and send conflict response
	if (addressBook.getAddressIndex(req.body) !== -1) {
		console.debug('attempted duplicate entry')
		return res.sendStatus(409)
	}

	// Modify the address model state to reflect the added address
	let addresses = addressBook.getAddresses()
	req.body['uuid'] = uuidv4() // generate random UUID for identification of this resource
	addresses.push(req.body)
	console.log(addresses)

	addressBook.setAddresses(addresses)

	// Save the new address
	try {
		addressBook.save()
	} catch (err) {
		console.error('could not save json file', err)
		this.hydrate() // revert set addresses state (hydrate pulls from file)
		return res.sendStatus(500) // halts continuing execution, and sends error status code with empty response
	}

	res.status(201).json(req.body)
}

/**
 * This function is used for the PUT operation to replace an address in the address book.
 * @param req - This will contain the payload for the address replacement, as well as the uuid of the resource (params)
 * @param res
 * @returns {*}
 */
exports.update = (req, res) => {
	console.debug(">>update", req.body, req.params)

	// Attempted to change to an existing record
	if (addressBook.getAddressIndex(req.body) !== -1) {
		return res.sendStatus(409)
	}

	// let addresses = addressBook.getAddresses()
	// addresses[req.params.id]
	//
	// res.sendStatus(200) // if updated

	res.sendStatus(201) // if created (good if someone else deletes it, while you were editing)
}

/**
 * Deletes an address from the address book. Checks for existence of element prior to deleting
 * @param req
 * @param res
 * @returns {*}
 */
exports.delete = (req, res) => {
	console.debug(">>delete", req.params)

	// Try to locate the resource position
	const addressIndex = addressBook.getAddressIndexByUUID(req.params.id)
	if (addressIndex === -1) {
		return res.sendStatus(204) // never a 404, as that exposes what exists
	}

	// Delete the element, and save
	let addresses = addressBook.getAddresses()
	addresses.splice(addressIndex, 1)
	addressBook.setAddresses(addresses)
	addressBook.save()

	res.sendStatus(204)
}

