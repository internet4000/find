import Find from '../../main'

const defaultSymbols = Find.symbols
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

// API: call to the store to get all symbols
const getDefaultSymbols = () => { return defaultSymbols }
const getUserSymbols = () => { return  getStorageUserSymbols() }

const addEngine = (symbol, engineId, url) => {
	if(!symbol || !engineId || !url) return
	let userSymbols = getStorageUserSymbols()
	userSymbols[symbol].engines[engineId] = url
	setStorageUserSymbols(userSymbols)
}

const deleteEngine = (symbol, engineId) => {
	if(!symbol || !engineId) return
	let userSymbols = getStorageUserSymbols()
	delete userSymbols[symbol].engines[engineId]
	setStorageUserSymbols(userSymbols)
}

export { getDefaultSymbols, getUserSymbols, addEngine, deleteEngine };
