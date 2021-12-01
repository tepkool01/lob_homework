const fs = require("fs")
const ADDRESS_FILE_PATH = 'src/models/addresses.json'

module.exports = class AddressBook {
	constructor() {
		this.addresses = []
		this.hydrate()
	}

	/**
	 * Saves the current state of the addresses array to the JSON file
	 */
	save() {
		fs.writeFileSync(ADDRESS_FILE_PATH, JSON.stringify(this.addresses));
	}

	/**
	 * Gets the position of an address object within the address book
	 * JSON.stringify is a poor man's solution to object comparison. Ordering of properties matters
	 * @param address
	 * @returns {number}
	 */
	getAddressIndex(address) {
		return this.addresses.findIndex(element => {
			return JSON.stringify(this._stripUUID(element)) === JSON.stringify(this._stripUUID(address))
		})
	}

	/**
	 * Finds the address index position by the UUID (unique identifier)
	 * @param id
	 * @returns {number}
	 */
	getAddressIndexByUUID(id) {
		return this.addresses.findIndex(element => {
			return element['uuid'] === id
		})
	}

	/**
	 * Retrieves the array of address objects, additional parsing could be performed here if necessary
	 * @returns {[]}
	 */
	getAddresses() {
		return this.addresses
	}

	/**
	 * Updates the addresses array with the data saved in the JSON file
	 * Is also a valuable mechanism to 'reset' or 'seed'/re-seed the data
	 */
	hydrate() {
		try {
			let addressesRaw = fs.readFileSync(ADDRESS_FILE_PATH, 'ascii');
			this.addresses = JSON.parse(addressesRaw);
		} catch (e) {
			console.error('Failed to read addresses', e)
		}
	}

	/**
	 * Removes the UUID from the address object, generally used for comparisons
	 * @param address
	 * @returns {Pick<*, Exclude<keyof *, "uuid">>}
	 * @private
	 */
	_stripUUID(address) {
		// console.debug('>>stripUUID', address)
		const { uuid, ...addressWithoutUUID } = address
		return addressWithoutUUID
	}
}