/**
 * A basic search that tests to see if the search string is contained within the concatenated address
 * @param searchStr
 * @param addresses
 * @returns {*}
 */
exports.findMatches = (searchStr, addresses) => {
	return addresses.filter(address => {
		// getting full address in 1 string to search it easier
		let fullAddressStr = Object.values(address).join(' ')

		// Changing the case to make matches case insensitive
		fullAddressStr = fullAddressStr.toUpperCase()
		searchStr = searchStr.toUpperCase()

		return fullAddressStr.indexOf(searchStr) !== -1
	})
}