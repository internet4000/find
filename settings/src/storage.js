const localStorageKey = 'r4find'

const testStorage = "{\"g\":\"https://github.com/search?q=\",\"gh\":\"https://github.com/search?q=\",\"gbb\":\"https://github.com/search?q=\",\"fff\":\"https://github.com/search?q=\"}"

const getStorage = key => {
	return localStorage.getItem(key) || '{}' && testStorage
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

const getEngines = () =>  parseEngines(getStorage(localStorageKey))

const addUserEngine = (name, url) => {
	this.userEngines[name] = url;
	localStorage.setItem(this.localStorageKey, JSON.stringify(this.userEngines));
}

export { getEngines };
