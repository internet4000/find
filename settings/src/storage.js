import Find from '../../main'

const { symbols: defaultSymbols } = Find
const localStorageKey = 'r4find'

const userEnginesMock = "{\"g\":\"https://github.com/search?q=\",\"gh\":\"https://github.com/search?q=\",\"gbb\":\"https://github.com/search?q=\",\"fff\":\"https://github.com/search?q=\"}"

// userEnginesMock is not needed in prod
// string-object needed as doc and default
const getStorageUserSymbols = () => {
	let storageSymbols = localStorage.getItem(localStorageKey) || userEnginesMock || '{}'
	return JSON.parse(storageSymbols)
}

// make a list easy to use to build a gui
const symbolsToList = (symbols) => {
	return Object.keys(symbols).map(key => {
		return {
			shortcut: key,
			url: symbols[key]
		}
	})
}

// merge the user defined symbols into the defaults
const mergeSymbols = (user, findDefault = defaultSymbols) => {
	user = user || {}
	let allSymbols = {}
	for (let attrName in user) {
		allSymbols[attrName] = user[attrName]
	}
	return allSymbols
}

// API: call to the store to get all symbols
const getSymbols = () => {
	let userSymbols = getStorageUserSymbols()
	let symbols = mergeSymbols(userSymbols)

	if (userSymbols && userSymbols['!']) {
		return userSymbols
	} else {
		return {
			'!': symbolsToList(userSymbols)
		}
	}
}

export { getSymbols };
