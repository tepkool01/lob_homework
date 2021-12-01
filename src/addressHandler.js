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
		let result = []
		let addresses = addressBook.getAddresses()
		if (req.query.hasOwnProperty('searchStr')) {
			result = searchService.findMatches(req.query.searchStr, addresses)
		}
		res.status(200).json(result)
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
	let addresses = addressBook.getAddresses()

	// grabbing the position of the element in the addresses array (model state) to edit; returns -1 if can't find, in
	// which case we will need to create the record (PUT verb idempotent spec)
	const addressUpdateIndex = addressBook.getAddressIndexByUUID(req.params.addressID)

	// Can't find the record to update, so we will need to add it
	if (addressUpdateIndex === -1) {
		addresses.push(req.body)
		return res.status(201).json(req.body)
	}
	// Found record -- remove item to be updated and replace it with the request payload
	addresses.splice(addressUpdateIndex, 1, req.body)
	addressBook.save()

	res.status(200).json(req.body) // if updated
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
	const addressIndex = addressBook.getAddressIndexByUUID(req.params.addressID)
	if (addressIndex === -1) {
		return res.sendStatus(204) // never a 404, as that exposes what exists
	}

	// Delete the element, and save
	let addresses = addressBook.getAddresses()
	addresses.splice(addressIndex, 1) // pass by reference allows us to modify this and have it affect the class
	addressBook.save()

	res.sendStatus(204)
}

