import Find from '../../main'

const defaultSymbols = Find.symbols
const localStorageKey = 'r4find'

const userEnginesMock = "{\"g\":\"https://github.com/search?q=\",\"gh\":\"https://github.com/search?q=\",\"gbb\":\"https://github.com/search?q=\",\"fff\":\"https://github.com/search?q=\"}"

// userEnginesMock is not needed in prod
// string-object needed as doc and default
const userSymbols = () => {
	let storageSymbols = localStorage.getItem(localStorageKey)

	if (storageSymbols) {
		let parsedSymbols = JSON.parse(storageSymbols)
		return parsedSymbols
	}

	// return JSON.parse(userEnginesMock) // for development
	return {}
}

// API: call to the store to get all symbols
const getSymbols = () => {
	const symbols = defaultSymbols
	symbols.user = {
		name: 'user',
		engines: userSymbols()
	}
	return symbols
}

export { getSymbols };
