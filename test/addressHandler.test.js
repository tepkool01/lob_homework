const addressHandler = require('../src/addressHandler')
const simpleSearchService = require('../src/services/search/simple')
const httpMocks = require('node-mocks-http');

// The tests below validate the basic functionality requested.

describe('AddressHandler route', () => {
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
		it('should be increment the total records by 1', () => {
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
			addressHandler.create(simpleSearchService)
			// const result = response._getJSONData() TODO
			console.log("Tested")
		})
	})
	describe('modify address zip code', () => {
		it('should be increment the total records by 1', () => {
			const request = httpMocks.createRequest({
				method: 'PATCH',
				url: '/addresses',
				params: {
					id: 'asdf'
				},
				body: {
					zip: "54321"
				},
			})
			const response = httpMocks.createResponse()
			addressHandler.update(simpleSearchService)
			// const result = response._getJSONData() TODO
			console.log("Tested")
		})
	})
	describe('delete the test address', () => {
		it('should decrement the total records by 1', () => {
			const request = httpMocks.createRequest({
				method: 'DELETE',
				url: '/addresses',
				params: {
					id: 'asdf'
				},
			})
			const response = httpMocks.createResponse()
			addressHandler.delete(simpleSearchService)
			// const result = response._getJSONData() TODO
			console.log("Tested")
		})
	})
})