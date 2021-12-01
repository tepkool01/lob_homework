const addressHandler = require('../src/addressHandler')
const AddressBookModel = require('../src/models/AddressBook')
const simpleSearchService = require('../src/services/search/simple')
const httpMocks = require('node-mocks-http');

const addressBook = new AddressBookModel()

// The tests below validate the basic functionality requested.
describe('AddressHandler route', () => {
	let createdAddress = {}
	describe('filter results based on search string', () => {
		it('should show 3 results when provided a "1600" search string', () => {
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/addresses',
				query: {
					searchStr: '1600'
				},
			})
			const response = httpMocks.createResponse()
			const suggestWithSimpleSearch = addressHandler.findAll(simpleSearchService)
			suggestWithSimpleSearch(request, response)
			const result = response._getJSONData()
			expect(result.length).toEqual(3)
		})
		it('should show 1 result when provided a "MD" search string', () => {
			const request = httpMocks.createRequest({
				method: 'GET',
				url: '/addresses',
				query: {
					searchStr: 'MD'
				},
			})
			const response = httpMocks.createResponse()
			const suggestWithSimpleSearch = addressHandler.findAll(simpleSearchService)
			suggestWithSimpleSearch(request, response)
			const result = response._getJSONData()
			expect(result.length).toEqual(1)
		})
	})
	describe('create new address', () => {
		it('should return the created address with a UUID', () => {
			const request = httpMocks.createRequest({
				method: 'POST',
				url: '/addresses',
				body: {
					line1: '1 Hobbiton Hill',
					city: 'The Shire',
					state: "MD",
					zip: "12345"
				},
			})
			const response = httpMocks.createResponse()
			addressHandler.create(request, response)
			createdAddress = response._getJSONData()
			expect(createdAddress).toHaveProperty('uuid')
			expect(createdAddress.line1).toEqual('1 Hobbiton Hill')
			expect(createdAddress.city).toEqual('The Shire')
			expect(createdAddress.state).toEqual('MD')
			expect(createdAddress.zip).toEqual('12345')
		})
	})
	describe('modify address zip code', () => {
		it('reflect the updated zip ', () => {
			const request = httpMocks.createRequest({
				method: 'PUT',
				url: `/addresses/${createdAddress.uuid}`,
				params: {
					addressID: createdAddress.uuid,
				},
				body: {
					uuid: createdAddress.uuid,
					line1: createdAddress.line1,
					line2: createdAddress.line2,
					city: createdAddress.city,
					state: createdAddress.state,
					zip: "99999",
				},
			})
			const response = httpMocks.createResponse()
			addressHandler.update(request, response)
			const result = response._getJSONData()
			expect(result.zip).toEqual('99999')
		})
	})
	describe('delete the test address', () => {
		it('should decrement the total records by 1', () => {
			addressBook.hydrate() // refreshing from file before finding the created record for deletion
			// exists before deletion
			expect(addressBook.getAddressIndexByUUID(createdAddress.uuid)).toBeGreaterThan(-1)

			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: `/addresses/${createdAddress.uuid}`,
				params: {
					addressID: createdAddress.uuid,
				},
			})
			const response = httpMocks.createResponse()
			addressHandler.delete(request, response)
			addressBook.hydrate() // need to re-pull from file to make sure it is gone
			expect(addressBook.getAddressIndexByUUID(createdAddress.uuid)).toEqual(-1)
		})
	})
})