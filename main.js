(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof module === "object" && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.Find = factory();
	}
})(typeof self !== "undefined" ? self : this, function () {
	// Just return a value to define the module export.
	// This example returns an object, but the module
	// can return a function as the exported value.
	var App = {
		localStorageKey: "i4find",
		queryParamName: "q",
		documentationUrl: "https://github.com/internet4000/find",
		symbols: {
			"!": {
				name: "search",
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
					y: "https://www.youtube.com/results?search_query={}",
					aurl: "https://web.archive.org/web/*/{}",
					aurlcdx: "https://web.archive.org/cdx/search/cdx?url={}",
					aurlid: "https://web.archive.org/web/20210311213055id_/{}",
				},
			},
			"+": {
				name: "do",
				engines: {
					aurl: "https://web.archive.org/save/{}",
					draw: "https://docs.google.com/drawings/create?title={}",
					doc: "https://docs.google.com/document/create?title={}",
					r4: "https://radio4000.com/add?url={}",
					r4p: "https://radio4000.com/{}/play",
					r4pr: "https://radio4000.com/{}/play/random",
					sheet: "https://docs.google.com/spreadsheets/create?title={}",
					gmail: "https://mail.google.com/mail/#inbox?compose=new&title={}",
					note: "https://note.internet4000.com/note?content={}",
					wr: "https://en.wikipedia.org/wiki/Special:Random",
					wri: "https://commons.wikimedia.org/wiki/Special:Random/File",
				},
			},
			"&": {
				name: "build",
				engines: {
					gh: "https://github.com/{}/{}",
					gl: "https://gitlab.com/{}/{}",
					firebase: "https://console.firebase.google.com/project/{}/overview",
					mx: "https://matrix.to/#/{}",
					netlify: "https://app.netlify.com/sites/{}/overview",
					r4: "https://radio4000.com/{}",
					ytid: "https://www.youtube.com/watch?v={}",
				},
			},
			"#": {
				name: "command",
				fns: {
					add: function (app, arg) {
						/* Find function to "add a new engine":
							 Example usage:
							 #add ! ex https://example.org/?search={}
						 */
						let [symbol, id, url] = arg.split(" ");
						if (
							symbol &&
							id &&
							window.confirm(`add ${symbol} ${id} ${url} ?`)
						) {
							app.addEngine(app.getUserSymbols(), symbol, id, url);
						}
					},
					del: function (app, arg) {
						/* Find function to "delete an existing engine":
							 Example usage:
							 #del ! ex
						 */
						let [symbol, id] = arg.split(" ");
						if (symbol && id && window.confirm(`del ${symbol} ${id} ?`)) {
							app.delEngine(app.getUserSymbols(), symbol, id);
						}
					},
				},
			},
		},

		// add a new user engine
		// to the list of user defined engines in user symbols
		addEngine(symbols, symbol, engineId, url) {
			if (symbols[symbol]) {
				symbols[symbol].engines[engineId] = url;
				this.setUserSymbols(symbols);
				console.info("Added new engine:", `${symbol}${engineId}`, url);
			} else {
				console.error("symbol", symbol, "does not exist in", symbols);
			}
		},

		// add a new user engine
		// to the list of user defined engines in user symbols
		delEngine(symbols, symbol, engineId) {
			const symbolExists = symbols[symbol];
			if (symbolExists) {
				delete symbols[symbol].engines[engineId];
				this.setUserSymbols(symbols);
				console.info("Removed engine:", `${symbol}${engineId}`);
			}
		},

		// replaces the placeholder () in a url, with the query, if any
		// otherwise just returns the url
		replaceUrlPlaceholders(url, query) {
			if (typeof url != "string" || typeof query != "string") return "";
			var matches = url.match(/\{\}/g) || [];
			if (!matches.length) return url;
			if (!query.length) return url.replace(/\/?\{\}\/?/g, "");
			if (matches.length === 1)
				return url.replace("{}", encodeURIComponent(query));

			query = query.trim();
			var splitQuery = (function () {
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
		},

		// To get an engine url from its engine id,
		// also pass a list of symbols and a symbol
		getEngineUrl(symbols, symbol, engineId) {
			var symbolEngines = symbols[symbol];
			var engineUrl = symbolEngines.engines[engineId];
			return engineUrl;
		},

		// returns a result url string to open
		// default to "search for help if only a symbol"
		buildResultUrl(
			userQuery,
			symbols = this.symbols,
			symbol = "!",
			engineId = "d"
		) {
			var app = this;

			// if symbol is fns, don't open url, but run the function
			if (symbol === "#") {
				var fns = symbols[symbol].fns[engineId];
				return fns(app, userQuery);
			}
			var engineUrl = this.getEngineUrl(symbols, symbol, engineId);
			return this.replaceUrlPlaceholders(engineUrl, userQuery);
		},

		// is there a symbol in this symbol group? `!ex` return `!` !
		checkForSymbol(symbolGroup) {
			var availableSymbols = Object.keys(this.symbols),
				symbol = symbolGroup.charAt(0);

			return availableSymbols.indexOf(symbol) >= 0 ? symbol : false;
		},

		// is an engine available in a array of symbolGroups
		getSymbolsForEngine(symbolGroups, symbol, engineId) {
			if (!symbolGroups.length) return false;
			var filteredGroups = symbolGroups.filter(function (symbols) {
				if (!symbols || !symbols[symbol]) return false;
				var engines = symbols[symbol].engines;
				var fns = symbols[symbol].fns;
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
		},

		// param:
		// - userQuery: string `!m new york city`
		// return:
		// - url: string to be openned by the browser
		decodeUserRequest(userRequest) {
			if (!userRequest) {
				return false;
			}

			var requestTerms = userRequest.split(" "),
				requestSymbolGroup = requestTerms[0],
				requestSymbol = this.checkForSymbol(requestSymbolGroup),
				requestEngineId = requestSymbolGroup.slice(1),
				allSymbolGroups = [this.getUserSymbols(), this.symbols];

			const returnData = {
				requestTerms,
				requestSymbolGroup,
				requestSymbol,
				requestEngineId,
				result: null,
			};

			// if there is no symbol, the whole userRequest is the query
			if (!requestSymbol) {
				returnData.result = this.buildResultUrl(userRequest);
			}

			// is the engine referenced in the	userSymbols or symbols
			// let selectedSymbols = this.getRequestedSymbols(allSymbolGroups, requestSymbol, requestEngineId);
			var selectedSymbols = this.getSymbolsForEngine(
				allSymbolGroups,
				requestSymbol,
				requestEngineId
			);

			// if there are no selectedSymbols, we don't know the engine
			if (!selectedSymbols && !returnData.result) {
				returnData.result = this.buildResultUrl(userRequest);
			}

			if (!returnData.result) {
				// if we know the symbol and engine,
				// the actual query is everything but the request's engine group (the first group)
				var userRequestNoSymbol = requestTerms
					.splice(1, requestTerms.length)
					.join(" ");

				returnData.result = this.buildResultUrl(
					userRequestNoSymbol,
					selectedSymbols,
					requestSymbol,
					requestEngineId
				);
			}

			return returnData;
		},

		// check whether URL starts with a scheme
		checkUrl(url) {
			return url.startsWith("//") || url.includes("://");
		},

		openUrl(url) {
			// replace history state
			// so after transition, clicking the back button does not hit find/?q=search
			// that would transition again to a search result
			if (!url) return;
			if (!this.checkUrl(url)) url = "//" + url;
			location.replace(url);
		},

		// takes a string, request query of a user, decode the request
		// and open the "correct destination site" with the user requested query
		find(request) {
			if (!request) return false;
			// all request need to succeed to opening a site on which to search
			const decodedRequest = this.decodeUserRequest(request);
			const { result } = decodedRequest;
			this.openUrl(result);
			return result;
		},

		init() {
			/* do-not extract user query/search from window url query param,
				 the value of the query parameters (are sent to the servers)
				 const query = url.searchParams.get('q');
				 use hash, fragment identifier instead (data not sent to server) */
			// take the current browser's full url
			const params = new URLSearchParams(window.location.hash.slice(1));
			const query = params.get(this.queryParamName);
			// if there is a value, let's "find" it
			if (query) {
				this.find(query);
			} else {
				console.info(
					"No `#` query routing in URL",
					window.location.href,
					query
				);
				/* else fallback to query param for legacy */
				const url = new URL(window.location.href);
				const queryParamVal = url.searchParams.get(this.queryParamName);
				if (queryParamVal) {
					this.find(queryParamVal);
				} else {
					console.info(
						"No search in the 'q' query parameter",
						window.location.href,
						queryParamVal
					);
				}
			}
		},

		// get the user symbols from local storage
		// or returns an empty new set of symbols
		getUserSymbols() {
			var storageSymbols;
			try {
				storageSymbols = JSON.parse(localStorage.getItem(this.localStorageKey));
			} catch (e) {
				if (e.name === "SyntaxError") {
					storageSymbols = null;
				}
			}

			if (!storageSymbols) {
				storageSymbols = this.newUserSymbols();
			}

			return JSON.parse(JSON.stringify(storageSymbols));
		},

		// saves a new set of user symbols to local storage
		setUserSymbols(newSymbols) {
			if (!newSymbols) return;
			const newSymbolsString = JSON.stringify(newSymbols);
			localStorage.setItem(this.localStorageKey, newSymbolsString);
			// cannot send event from here; we might be in browser/node
		},

		// generates new userSymbols from copying original symbols
		// to be used with Find default symbols (Find.symbols)
		newUserSymbols() {
			var fromSymbols = this.symbols;
			var symbols = JSON.parse(JSON.stringify(fromSymbols));
			Object.keys(symbols).forEach((symbol) => {
				symbols[symbol].engines = {};
				if (symbol === "#") {
					delete symbols[symbol];
				}
			});
			return symbols;
		},

		help() {
			// write user documentation
			console.info(`Documentation: ${this.documentationUrl}`);
			console.info("— Usage: Find.find('!m brazil')");
			console.info("- Usage: Find.getUserSymbols()");
			console.info("- Usage:", "#add ! ex https://example.org/?search={}");
			console.info("— Explore the window.Find object");
		},
	};

	// initialize the app
	App.init();

	return App;
});
