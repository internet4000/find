import Find from '../../main'

const { symbols: defaultSymbols } = Find
const localStorageKey = 'r4find'

const userEnginesMock = "{\"g\":\"https://github.com/search?q=\",\"gh\":\"https://github.com/search?q=\",\"gbb\":\"https://github.com/search?q=\",\"fff\":\"https://github.com/search?q=\"}"

// userEnginesMock is not needed in prod
// string-object needed as doc and default
const getStorageUserSymbols = () => {
	let storageSymbols = localStorage.getItem(localStorageKey) || userEnginesMock || '{}'
	let parsedSymbols = JSON.parse(storageSymbols)

	if (parsedSymbols['!']) {
		return parsedSymbols
	} else {
		return {
			'!': {
				engines: parsedSymbols
			}
		}
	}
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

	const applySymbols = (defaults, s) => {
		Object.keys(s).forEach(symbol => {
			defaults[symbol] = defaults[symbol] || {}
			for (let engineId in s[symbol]) {
				defaults[symbol].engines[engineId] = s[symbol][engineId]
			}
		})
		return defaults
	}
	return applySymbols(findDefault, user)
}

// API: call to the store to get all symbols
const getSymbols = () => {
	return {
		defaultSymbols,
		userSymbols: getStorageUserSymbols()
	}
}

export { getSymbols };
