const localStorageKey = 'r4find'

const testStorage = "{\"g\":\"https://github.com/search?q=\",\"gh\":\"https://github.com/search?q=\",\"gbb\":\"https://github.com/search?q=\",\"fff\":\"https://github.com/search?q=\"}"

const getStorage = key => {
	let storage = parseEngines(
		localStorage.getItem(localStorageKey) || testStorage
	) || {}
	if (!storage['!']) {
		return {
			'!': storage
		}
	} else {
		return storage
	}
}

const parseEngines = engines => {
	let enginesObject = JSON.parse(engines)
	return Object.keys(enginesObject).map(key => {
		return {
			shortcut: key,
			url: enginesObject[key]
		}
	})
}

const getEnginesFromSymbol = (symbol) => {
	let allEngines = getStorage()
	const symbolEngines = allEngines[symbol] || []
	return symbolEngines
}

const getSearchEngines = () =>  getEnginesFromSymbol('!')
const getActionEngines = () =>  getEnginesFromSymbol('+')

export { getSearchEngines };
