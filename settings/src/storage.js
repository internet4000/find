import Find from '../../main'

const { symbols: defaultSymbols } = Find
const localStorageKey = 'i4find'

const newUserSymbols = (symbols = defaultSymbols) => {
	Object.keys(symbols).forEach(symbol => {
		symbols[symbol].engines = {}
		if(symbol === '#') {
			delete symbols[symbol]
		}
	})
	return symbols
}

// userEnginesMock is not needed in prod
// string-object needed as doc and default
const getStorageUserSymbols = () => {
	let storageSymbols;
	try {
		storageSymbols = JSON.parse(
			localStorage.getItem(localStorageKey)
		)
	} catch(e) {
		if(e.name === 'SyntaxError') {
			storageSymbols = null
		}
	}

	return storageSymbols || newUserSymbols()
}

const setStorageUserSymbols = symbols => {
	if (!symbols) return
	localStorage.setItem(localStorageKey, JSON.stringify(symbols))
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

const addEngine = (symbol, engineId, url) => {
	let userSymbols = getStorageUserSymbols()
	userSymbols[symbol].engines[engineId] = url
	setStorageUserSymbols(userSymbols)
}

const deleteEngine = (symbol, engineId) => {
	let userSymbols = getStorageUserSymbols()
	delete userSymbols[symbol].engines[engineId]
	setStorageUserSymbols(userSymbols)
}

export { getSymbols, addEngine, deleteEngine };
