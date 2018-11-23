const localStorageKey = 'r4find'

const testStorage = "{\"g\":\"https://github.com/search?q=\",\"gh\":\"https://github.com/search?q=\",\"gbb\":\"https://github.com/search?q=\",\"fff\":\"https://github.com/search?q=\"}"

const getStorage = () => (
	JSON.parse(localStorage.getItem(localStorageKey) || testStorage)
)

const symbolsToList = (symbols) => {
		return Object.keys(symbols).map(key => {
			return {
				shortcut: key,
				url: symbols[key]
			}
		})
	}

const getSymbols = () => {
	let storage = getStorage()
	if (storage && storage['!']) {
		return storage
	} else {
		return {
			'!': symbolsToList(storage)
		}
	}
}

export { getSymbols };
