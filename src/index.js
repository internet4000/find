/* if we are in node, polyfill what's missing to work */
const isBrowser = typeof window !== "undefined";
const isNode = typeof process !== "undefined";
if (typeof window === "undefined") {
	globalThis.window = {};
	window.location = new URL("i4k-find://");
}

/* Map of default `symbols`, `engines` (their `id` and `URL`);
	 There is the possibility of `userSymbols` with the same structure.
	 Ideas for symbols and functions (not user defined yet):
	 - https://www.gnu.org/software/bash/manual/bash.html
	 - https://en.wikipedia.org/wiki/APL_syntax_and_symbols
	 - https://en.wikipedia.org/wiki/List_of_Lisp-family_programming_languages
	 - DDG bangs, firefox URL prefixes
 */
export class I4kFindSymbols {
	get default() {
		return {
			"!": {
				name: "search",
				uri: encodeURIComponent("!"),
				engines: {
					"?": `${window.location.href}/#q=!docs%20{}`,
					docs: "https://github.com/internet4000/find/#{}",
					c: "https://contacts.google.com/search/{}",
					cdn: "https://www.jsdelivr.com/?query={}",
					ciu: "https://caniuse.com/#search={}",
					d: "https://duckduckgo.com/?q={}",
					dd: "https://devdocs.io/#q={}",
					dr: "https://drive.google.com/drive/search?q={}",
					g: "https://encrypted.google.com/search?q={}",
					gh: "https://github.com/search?q={}",
					gho: "https://github.com/search?q=org:{}",
					ghu: "https://github.com/search?q=user:{}",
					ghr: "https://github.com/search?q=repo:{}",
					hn: "https://hn.algolia.com/?sort=byDate&query={}",
					k: "https://keep.google.com/?q=#search/text%3D{}",
					l: "https://www.linguee.com/search?query={}",
					m: "https://www.google.com/maps/search/{}",
					npm: "https://www.npmjs.com/search?q={}",
					osm: "https://www.openstreetmap.org/search?query={}",
					r4: "https://radio4000.com/search?search={}",
					so: "https://stackoverflow.com/search?q={}",
					tr: "https://translate.google.com/?q={}",
					vinyl: "https://vinyl.internet4000.com/#gsc.q={}",
					w: "https://en.wikipedia.org/w/index.php?search={}",
					wa: "http://www.wolframalpha.com/input/?i={}",
					wdev: "https://developer.mozilla.org/search?q={}",
					y: "https://www.youtube.com/results?search_query={}",
					aurl: "https://web.archive.org/web/*/{}",
					aurlcdx: "https://web.archive.org/cdx/search/cdx?url={}",
					aurlid: "https://web.archive.org/web/20210311213055id_/{}",
				},
			},
			"+": {
				name: "do",
				uri: encodeURIComponent("+"),
				engines: {
					aurl: "https://web.archive.org/save/{}",
					draw: "https://www.tldraw.com",
					/*
						 WebBrowsers cannot directly open "data URLs",
						 so (we will generate a goog.space with the "data URL to copy",
						 via a new find query).
						 ref: https://developer.mozilla.org/en-US/docs/web/http/basics_of_http/data_urls
						 data:[<mediatype>][;base64],<data>
						 data:text/html,<script>alert('hi');</script>
						 // how to handle the `;` for "optional param" ("named param" etc.)
						 // should we change the placeholder from {} to [] to match URI/MDN?
					 */
					data: "data:{}:{},{}",
					"data-plain": "data:,{}",
					"data-html": "data:text/html,{}",
					"data-json": "data:application/json;charset=utf-8,{}",
					/* special utilities */
					"data-64": "data:;base64,{}",
					"data-un64": "data:,{}",

					/* new google doc with title (no content query param;
						 or named param for multiple strings and spaces
						 (body, title, strings, lists etc.) */
					doc: "https://docs.google.com/document/create?title={}",

					/* A utility to go to Find the *local* development URL,
						 since we no not store the find URL in the browser history;
						 Also could allow access to locally executed functions.
						 Note: ONLY "HTTP" (no -S-) URL */
					local: "http://localhost:3000",
					r4: "https://radio4000.com/add?url={}",
					r4p: "https://radio4000.com/{}/play",
					r4pr: "https://radio4000.com/{}/play/random",
					sheet: "https://docs.google.com/spreadsheets/create?title={}",
					gmail: "https://mail.google.com/mail/#inbox?compose=new&title={}",
					gpt: "https://chat.openai.com/?model=gpt-4",
					note: "https://note.internet4000.com/note?content={}",

					/* "pollyfill the 'view-source:' for mobile device?
						 browser catch that first when know how to handle " */
					"view-source": "data:,{}",
					wr: "https://en.wikipedia.org/wiki/Special:Random",
					wri: "https://commons.wikimedia.org/wiki/Special:Random/File",
					rtc: "https://sctlib.gitlab.io/rtc/?method={}&matrix-peers={}",
					rtcmx:
				"https://sctlib.gitlab.io/rtc/?matrix-peers={}&method=matrix-user-device",
					space: "https://goog.space/#input={}",
				},
			},
			"&": {
				name: "build",
				uri: encodeURIComponent("&"),
				engines: {
					gh: "https://github.com/{}/{}",
					gl: "https://gitlab.com/{}/{}",
					i4kn: "https://{}.4000.network/{}",
					internet: "https://portal.mozz.us/{}/{}/",
					firebase: "https://console.firebase.google.com/project/{}/overview",
					mx: "https://matrix.to/#/{}",
					netlify: "https://app.netlify.com/sites/{}/overview",
					r4: "https://radio4000.com/{}",
					r4c: "https://{}.4000.radio/{}",
					so: "https://stackoverflow.com/questions/{}/",
					ytid: "https://www.youtube.com/watch?v={}",
				},
			},
			"#": {
				name: "command",
				uri: encodeURIComponent("#"),
				fns: {
					help(app, arg) {
						/* Finds help URL for a user query (with symbol) or not */
						app.help();
						if (arg) {
							const {symbol} = app.decodeUserRequest(arg)
							if (symbol) {
								app.find(arg);
							} else {
								app.find(`!? ${arg}`);
							}
						}
					},
					add(app, arg) {
						/* Find function to "add a new engine":
							 Example usage (spaces matter):
							 #add ! ex https://example.org/?search={}
						 */
						const [symbol, id, url] = arg.split(" ");
						if (symbol && id && url) {
							app.addEngine(app.getUserSymbols(), symbol, id, url);
						}
					},
					del(app, arg) {
						/* Find function to "delete an existing engine":
							 Example usage (spaces matter):
							 #del ! ex
						 */
						let [symbol, id] = arg.split(" ");
						if (symbol && id) {
							 app.delEngine(app.getUserSymbols(), symbol, id);
						}
					},
					export(app, arg) {
						/* Export userSymbols as data:json to a goog.space */
						const userSymbols = app.getUserSymbols()
						app.find(`+data-json ${JSON.stringify(userSymbols)}`)
					},
					import(app, jsonObjOrStr) {
						/* Import user symbols from a JSON Object or String  */
						if (jsonObjOrStr) {
							app.importUserSymbols(jsonObjOrStr)
						}
					}
				},
			},
		};
	}
	constructor(userSymbols = {}) {
		if (userSymbols) {
			this.symbols = this.newUserSymbols(userSymbols)
		} else {
			this.symbols = this.newUserSymbols()
		}
		return this
	}
	/* do not allow custom functions/commands (execute security risk;
		 maybe until there is a decided URL DSL for Find),
		 or custom symbol (community semantic on Find instance)*/
	newUserSymbols(initialSymbolsMap = {}) {
		return Object.keys(this.default)
								 .filter((symbol) => !["#"].includes(symbol))
								 .reduce((acc, symbol) => {
									 acc[symbol] = {}
									 const userSymbolData = initialSymbolsMap[symbol] || { engines: {} }
									 const userEnginesForSymbol = userSymbolData.engines
									 acc[symbol].engines = {}
									 if (userEnginesForSymbol) {
										 if (symbol === "#" || !this.default[symbol]) {
											 // noop
										 } else {
											 acc[symbol].engines = userEnginesForSymbol
										 }
									 }
									 return acc
								 }, {})
	}
}

/* a list of the default symbols */
export const DEFAULT_SYMBOLS = new I4kFindSymbols().default

/* generate the OSD needed to register as a browser search engine */
export class OpenSearchDescription {
	get attributes() {
		return [
			"shortName",
			"description",
			"templateHTML",
			"templateXML",
			"templateSuggestionsJSON",
			"image",
		];
	}
	get config() {
		return this.attributes.reduce((acc, val) => {
			acc[val] = this[val];
			return acc;
		}, {});
	}
	constructor(config) {
		this.attributes.forEach((attr) => {
			const isSet = config.hasOwnProperty(attr);
			const val = isSet ? config[attr] : DEFAULT_OSD[attr];
			this[attr] = val;
		});
	}
	exportJSON() {
		return JSON.stringify({ ...this.config }, null, 2);
	}
	exportXML() {
		const config = { ...this.config };
		return `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<InputEncoding>UTF-8</InputEncoding>
	<ShortName>${config.shortName}</ShortName>
	<Description>${config.description}</Description>
	<Image height="64" width="64" type="image/png">${config.image}</Image>
	<Url type="text/html" template="${config.templateHTML}" method="GET"/>
	<Url type="application/opensearchdescription+xml" rel="search" template="${config.templateXML}" method="GET"/>
	<Url type="application/x-suggestions+json" rel="suggestions" template="${config.templateSuggestionsJSON}" method="GET"/>
</OpenSearchDescription>`;
		/* <moz:SearchForm>${config.templateHTML}</moz:SearchForm> */
	}
}

/* the logic for search engines and actions */
export class I4kFind {
	constructor({
		symbols,
		queryParamName,
		localStorageKey,
		osd,
	} = {}) {
		this.localStorageKey = localStorageKey || "i4find";
		this.queryParamName = queryParamName || "q";
		// default I4KSymbol map of available symbols
		this.symbols = symbols || new I4kFindSymbols().default;
		this.osd = new OpenSearchDescription(osd || DEFAULT_OSD);
	}

	/* add a new user engine to the list of user symbols' engines */
	addEngine(symbols, symbol, engineId, url) {
		if (this.symbols[symbol]) {
			symbols[symbol].engines[engineId] = url;
			this.setUserSymbols(symbols);
		} else {
			console.error("symbol", symbol, "does not exist in", symbols);
		}
	}

	// add a new user engine
	// to the list of user defined engines in user symbols
	delEngine(symbols, symbol, engineId) {
		const symbolExists = symbols[symbol];
		if (symbolExists) {
			delete symbols[symbol].engines[engineId];
			this.setUserSymbols(symbols);
		}
	}

	// replaces the placeholder `{}` in a url, with the query, if any
	// otherwise just returns the url
	replaceUrlPlaceholders(url, query) {
		if (typeof url !== "string" || typeof query !== "string") return "";
		const matches = url.match(/\{\}/g) || [];
		if (!matches.length) return url;
		if (!query.length) return url.replace(/\/?\{\}\/?/g, "");
		if (matches.length === 1) {
			return url.replace("{}", encodeURIComponent(query));
		}

		query = query.trim();
		const splitQuery = (function () {
			return (
				(query.includes("/") && query.split("/")) ||
				(query.includes(" ") && query.split(" ")) ||
				query.split()
			);
		})();

		matches.forEach(function (queryItem, index) {
			if (index >= splitQuery.length) {
				url = url.replace(/\/?\{\}\/?/g, "");
			} else {
				url = url.replace("{}", encodeURIComponent(splitQuery[index]));
			}
		});
		return url;
	}

	// To get an engine url from its engine id,
	// also pass a list of symbols and a symbol
	getEngineUrl(symbols, symbol, engineId) {
		const symbolData = symbols[symbol];
		let engineUrl;
		if (symbol === "#") {
			engineUrl = symbolData.fns[engineId];
		} else {
			engineUrl = symbolData.engines[engineId];
		}
		return engineUrl;
	}

	// returns a result url string to open
	// default to "search for help if only a symbol"
	// idea: https://en.wikipedia.org/wiki/Interpreter_(computing)
	buildEngineResultUrl(
		userQuery,
		symbols = this.symbols,
		symbol = "!", // "search" by default
		engineId = "d" // on the "default" engine
	) {
		const engineUrl = this.getEngineUrl(symbols, symbol, engineId);
		return this.replaceUrlPlaceholders(engineUrl, userQuery);
	}

	// is there a symbol in this symbol group? `!ex` return `!` !
	checkForSymbol(symbolGroup) {
		const availableSymbols = Object.keys(this.symbols),
			symbol = symbolGroup.charAt(0);

		return availableSymbols.indexOf(symbol) >= 0 ? symbol : false;
	}

	/* in a list of symbolsMap,
		 is an engine available  (priorize first symbolsMap, the user's)*/
	getSymbolsMapForEngine(symbolMaps, symbol, engineId) {
		if (!symbolMaps.length) return false;
		const filteredGroups = symbolMaps.filter(function (symbols) {
			if (!symbols || !symbols[symbol]) return false;
			const engines = symbols[symbol].engines;
			const fns = symbols[symbol].fns;
			if (engines) {
				return engines[engineId] ? true : false;
			}
			if (fns) {
				return fns[engineId] ? true : false;
			}

			return false;
		});
		if (!filteredGroups.length) return false;
		return filteredGroups[0];
	}

	// param:
	// - userQuery: string `!m new york city`
	// return:
	// - url: string to be openned by the browser
	// idea: https://en.wikipedia.org/wiki/Lexical_analysis
	decodeUserRequest(userRequest) {
		if (!userRequest) {
			return false;
		}

		const tokens = userRequest.split(" "),
			symbolGroup = tokens[0],
			symbol = this.checkForSymbol(symbolGroup),
			engineId = symbolGroup.slice(1),
			allSymbolMaps = [this.getUserSymbols(), this.symbols];

		const decodedRequest = {
			tokens,
			symbolGroup,
			symbol,
			engineId,
			result: null,
		};

		// is the engine referenced in the	userSymbols or symbols
		// let selectedSymbols = this.getRequestedSymbols(allSymbolMaps, symbol, engineId);
		const symbolsMapWithEngine = this.getSymbolsMapForEngine(
			allSymbolMaps,
			symbol,
			engineId
		);

		// if there is no symbol, the whole userRequest is the query
		if (!symbol) {
			decodedRequest.result = this.buildEngineResultUrl(userRequest);
		}

		// if there are no symbolsMapWithEngine, we don't know the engine
		if (!decodedRequest.result && !symbolsMapWithEngine) {
			decodedRequest.result = this.buildEngineResultUrl(userRequest);
		}

		if (!decodedRequest.result) {
			// if we know the symbol and engine,
			// the actual query is everything but the request's engine group (the first group)
			const userRequestWithoutSymbol = tokens
				.splice(1, tokens.length)
				.join(" ");

			/* if the symbol is for a function, the result is the user request */
			if (symbol === "#") {
				decodedRequest.result = userRequestWithoutSymbol
			} else {
				decodedRequest.result = this.buildEngineResultUrl(
					userRequestWithoutSymbol,
					symbolsMapWithEngine,
					symbol,
					engineId
				);
			}
		}
		return decodedRequest;
	}

	// check whether URL starts with a scheme
	checkUrl(url) {
		return url.startsWith("//") || url.includes("://");
	}

	openUrl(url) {
		// replace history state
		// so after transition, clicking the back button does not hit find/?q=search
		// that would transition again to a search result
		if (!url) return;
		if (!this.checkUrl(url)) url = "//" + url;

		/* when in browser */
		if (isBrowser) {
			window.location.replace(url);
		} else if (isNode && process.env.BROWSER) {
			// noop
		}
		return url;
	}

	// takes a string, request query of a user, decode the request
	// and open the "correct destination site" with the user requested query
	// we want that all request succeed in opening a resulting website
	// (AND?/OR) interpret the result with an other find action/query
	// idea: https://en.wikipedia.org/wiki/GNU_Readline
	find(request, openInBrowser = true) {
		if (!request) return false;
		const decodedRequest = this.decodeUserRequest(request);
		const { result } = decodedRequest;
		const {open, display, exec} = this.findUserAction(decodedRequest, openInBrowser)
		/* depending on the requested user/symbol(consequence) action,
			 decide of an action to "evaluate" (open,display,tbd...); */
		if (open) {
			this.openUrl(result);
		} else if (display) {
			/* we will display in the "+space" symbol engine,
				 (encodeURIComponent result?) */
			this.find(`+space ${result}`)
		} else if (exec) {
			this.execUserRequest(decodedRequest)
		}
		return result;
	}
	execUserRequest(decodedRequest) {
		const {symbol, engineId, result} = decodedRequest
		const fns = this.symbols[symbol].fns[engineId];
		fns(this, result);
	}
	findUserAction(decodedRequest, openInBrowser) {
		const action = {
			display: false,
			open: false,
			exec: false, // user defined `#` functions
		}
		/* treat the special cases, which should probably not "open a tab"
			 because "re-read as a user-query" */
		if (decodedRequest.symbol === "+") {
			// for all "do" action, which results in "data:" (a URI for no website)
			if (decodedRequest.result.startsWith("data:")) {
				action.display = true
			}
		}
		/* exec (user defined) functions */
		if (decodedRequest.symbol === "#") {
			action.exec = true
		}
		/* by default we want to open a browser window/tab, if no "display|exec|..." requested */
		if (openInBrowser && !action.display && !action.exec) {
			action.open = true;
		}
		return action
	}

	// params: none
	// URL-hash-params: `q` the user query as a string we will decode
	// idea: https://en.wikipedia.org/wiki/Init
	init() {
		/* do-not extract user query/search from window url query param,
			 the value of the query parameters (are HTTP sent to the server)
			 const query = url.searchParams.get('q');
			 use hash-param, fragment identifier instead (data not sent to server)
		 */
		// take the current browser's full url
		const params = new URLSearchParams(window.location.hash.slice(1));
		const query = params.get(this.queryParamName);
		// if there is a value in `#` URL hash, let's "find" it
		let result;
		if (query) {
			result = this.find(query);
		} else {
			/* else fallback to query param for legacy */
			const url = new URL(window.location.href);
			const queryParamVal = url.searchParams.get(this.queryParamName);
			if (queryParamVal) {
				result = this.find(queryParamVal);
			} else {
				// "No search in the 'q' query parameter", noop (yet)
			}
		}
		return result;
	}

	// get the user symbols from local storage
	// or returns an empty new set of symbols
	getUserSymbols() {
		let userSymbols = {};
		try {
			userSymbols = JSON.parse(localStorage.getItem(this.localStorageKey));
		} catch (e) {
			if (e.name === "SyntaxError") {
				userSymbols = null;
			}
		}
		if (!userSymbols) {
			userSymbols = this.newUserSymbols();
		}
		return userSymbols;
	}

	// saves a new set of user symbols to local storage
	setUserSymbols(sourceSymbols) {
		if (!sourceSymbols) return;
		const serializedSymbols = this.newUserSymbols(sourceSymbols)
		const symbolsString = JSON.stringify(serializedSymbols);
		localStorage.setItem(this.localStorageKey, symbolsString);
		// cannot send event from here; we might be in browser||node.js
	}

	// generates new userSymbols from copying original symbols
	// to be used with Find default symbols (Find.symbols)
	importUserSymbols(sourceSymbolsJSONAny) {
		let userSymbols = null;
		if (typeof sourceSymbolsJSONAny === 'string') {
			try {
				const sData = JSON.parse(sourceSymbolsJSONAny)
				userSymbols = sData
			} catch(e) {}
		} else if (typeof sourceSymbolsJSONAny === 'object') {
			userSymbols = sourceSymbolsJSONAny
		}
		if (userSymbols) {
			/* "an entire object" */
			if (userSymbols.userSymbols) {
				this.setUserSymbols(this.newUserSymbols(userSymbols.userSymbols))
			} else {
				this.setUserSymbols(this.newUserSymbols(userSymbols))
			}
		}
	}
	newUserSymbols(initialSymbols) {
		return new I4kFindSymbols(initialSymbols).symbols
	}
}

/* find's default OSD */
export const DEFAULT_OSD = {
	shortName: "Find",
	description: "Find anything anywhere",
	image: "https://internet4000.github.io/find/assets/favicon.ico",
	templateHTML: "https://internet4000.github.io/find/#q={searchTerms}",
	templateXML: "https://internet4000.github.io/find/assets/opensearch.xml",
	templateSuggestionsJSON:
		"https://internet4000.github.io/find/api/suggestions/#q={searchTerms}",
};

const App = new I4kFind();

/* handle node input if any */
if (!isBrowser && isNode && process.argv.length > 2) {
	const userArg = process.argv.slice(2).join(" ");
	App.find(userArg);
}

/* let's register a service worker,
	 to try work with the open-search suggestions api, on client side only */
if (isBrowser) {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", async () => {
			try {
				const moduleUrlPaths = import.meta.url.split("/");
				const moduleUrl = moduleUrlPaths
					.slice(0, moduleUrlPaths.length - 2)
					.join("/");
				/* we locate the file at the root of the project,
					 to have a "large scope for catching fetch requests" */
				const sw = await navigator.serviceWorker.register(
					`${moduleUrl}/service-worker.js`
				);
				if (sw.active) {
					/* we can't pass the entire app */
					sw.active.postMessage(
						JSON.stringify({
							userSymbols: App.getUserSymbols(),
							symbols: App.symbols,
							pathname: window.location.pathname,
						})
					);
				}
			} catch (e) {
				console.info("Could not register service worker", e);
			}
		});
	}
}

export default App;
