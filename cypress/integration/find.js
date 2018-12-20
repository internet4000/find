import Find from '../../main.js'

describe('Find', function() {
	it('is available as "Find" in the global window object', () => {
		// Note, the server is started as part of the "test" script in package.json.
		cy.visit('http://localhost:3030')
		cy.window().should('have.property', 'Find')
	})

	it('decodes search queries as expected', () => {
		cy.window().then(win => {
			function assertQuery(query, expected) {
				assert.equal(win.Find.decodeUserRequest(query), expected, query)
			}

			assertQuery('!m brazil', 'https://www.google.com/maps/search/brazil')
			assertQuery('!g brazil', 'https://encrypted.google.com/search?q=brazil')
			assertQuery('!r4 my radio', 'https://radio4000.com/search?search=my radio')
			assertQuery(
				'+r4 https://www.youtube.com/watch?v=sZZlQqG7hEg',
				'https://radio4000.com/add?url=https://www.youtube.com/watch?v=sZZlQqG7hEg'
			)
		})
	})

	it('shows a form with input and button', () => {
		cy.visit('http://localhost:3030')
		cy.get('form input')
			.type('!discogs hallogalli')
			.should('have.value', '!discogs hallogalli')
		// Can't test this because it redirects to an external domain,
		// which is blocked by iframe cross-origin stuff.
		// cy.get('form button').click()
	})

	it('decodes placholders in url', () => {
		function assertQuery(query, expected) {
			assert.equal(Find.decodeUserRequest(query), expected, query)
		}
		assertQuery('&gh internet4000/radio4000', 'https://github.com/internet4000/radio4000')
		assertQuery('&gh internet4000/radio4000', 'https://github.com/internet4000/radio4000')
	})

	it('has a method to replace a placeholder', () => {
		assert.equal(typeof Find.replaceUrlPlaceholders, 'function')
	})

	it('can look up engine url', () => {
		assert.equal(
			Find.getEngineUrl(Find.symbols, '!', 'g'),
			'https://encrypted.google.com/search?q={}'
		)
		assert.equal(Find.getEngineUrl(Find.symbols, '!', 'doesntexist'), undefined)
	})

	it('can check if a query has a symbol', () => {
		assert.equal(Find.checkForSymbol('!salad'), '!')
		assert.equal(Find.checkForSymbol('+cheese'), '+')
		assert.equal(Find.checkForSymbol('*cheese'), false)
		assert.equal(Find.checkForSymbol('yolo'), false)
	})
})
