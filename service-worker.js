/* not yet supported for type module ;( */
/* self.importScripts("./src/index.js"); */

self.symbols = {};
self.userSymbols = {};
self.allSymbols = {};
self.allEngines = [];

/* mock find/osd until we can import it */
const Find = {
	suggestSymbols(searchQuery) {
		const symbol = searchQuery.slice(0, 1);
		const symbolData = self.allSymbols[symbol];
		if (symbolData) {
			const symbolEngines = self.allSymbols[symbol].engines;
			const symbolName = self.allSymbols[symbol].name;
			return _createSuggestions({
				searchQuery,
				symbol,
				symbolEngines,
				symbolName,
			});
		} else {
			return _createSuggestions({ searchQuery });
		}
	},
};

const _createSuggestions = ({
	searchQuery,
	symbol,
	symbolEngines,
	symbolName,
}) => {
	const matchingEngines = self.allEngines.filter((engineData) => {
		const [eSymbol, eId, eUrl, eSearch] = engineData;
		return eSearch.includes(searchQuery);
	});
	console.log("matchingEngines", matchingEngines);
	const suggestedEngines = matchingEngines.map((engineData) => {
		const [eSymbol, eId, eUrl, eSearch] = engineData;
		return [eSymbol, eId];
	});
	return [searchQuery, suggestedEngines];
};

const _mergeSymbols = (symbols, userSymbols) => {
	return Object.keys(symbols).reduce((acc, currKey) => {
		acc[currKey] = {
			engines: { ...symbols[currKey].engines },
		};
		acc[currKey] = {
			engines: { ...acc[currKey]?.engines, ...userSymbols[currKey]?.engines },
		};
		acc[currKey].name = symbols[currKey].name;
		return acc;
	}, {});
};

const _mergeEngines = (allSymbols) => {
	return Object.keys(allSymbols).reduce((acc, symbol) => {
		const symbolData = allSymbols[symbol];
		const symbolEngines = Object.entries(symbolData.engines);
		const engines = [
			...acc,
			...symbolEngines.map(([engine, url]) => {
				return [symbol, engine, url, `${symbol + engine + " " + url}`];
			}),
		];
		return engines;
	}, []);
};

const _handleFetch = (event) => {
	console.log("sw handle fetch", event.request.url);
	const url = new URL(event.request.url);
	if (url.pathname === "/api") {
		return event.respondWith(_respondWithApiRoot(event.request));
	} else if (url.pathname.startsWith("/api/suggestions")) {
		return event.respondWith(_respondWithSuggestions(event.request));
	} else {
		return self.fetch(event.request.url);
	}
};

const _respondWithSuggestions = (request) => {
	// Parse the hash query param from the request URL
	const url = new URL(request.url);
	const params = new URLSearchParams(url.hash.slice(1));
	const searchQuery = params.get("q");
	let suggestionBody;
	try {
		suggestionBody = Find.suggestSymbols(searchQuery);
	} catch (e) {
		console.info("Could not fetch any suggestion", e);
	}
	/* https://stackoverflow.com/questions/36535642/serving-an-opensearch-application-x-suggestionsjson-through-a-service-worker */
	return new Response(JSON.stringify(suggestionBody), {
		status: 200,
		headers: { "Content-Type": "application/x-suggestions+json" },
	});
};

const _respondWithApiRoot = (request) => {
	const body = {
		message: "Welcome to the client side Find API",
		suggestions: "api/sugestions#q={searchTerms}",
	};
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { "Content-Type": "application/x-suggestions+json" },
	});
};

const _handleMessage = ({ data }) => {
	const { symbols, userSymbols } = JSON.parse(data);
	/* assign the data on the worker self global object;
		 so we can re-use these values in the suggestions */
	self.symbols = symbols;
	self.userSymbols = userSymbols;
	self.allSymbols = _mergeSymbols(symbols, userSymbols);
	self.allEngines = _mergeEngines(self.allSymbols);
};

self.addEventListener("install", (event) => {
	console.info("Service worker installed");
});

self.addEventListener("activate", (event) => {
	console.info("Service worker activated");
});

self.addEventListener("fetch", _handleFetch);

self.addEventListener("message", _handleMessage);
