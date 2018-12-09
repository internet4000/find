(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.Find = factory();
	}
}(typeof self !== 'undefined' ? self : this, function () {

	// Just return a value to define the module export.
	// This example returns an object, but the module
	// can return a function as the exported value.
	var App = {
		localStorageKey: "i4find",
		symbols: {
			'!': {
				name: 'search',
				engines: {
					a: 'https://www.amazon.com/gp/search?tag=internet4000-20&keywords=',
					c: 'https://contacts.google.com/search/',
					ciu: 'https://caniuse.com/#search=',
					d: 'https://duckduckgo.com/?q=',
					dd: 'https://devdocs.io/#q=',
					dr: 'https://drive.google.com/drive/search?q=',
					e: 'http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=9&pub=5575347480&toolid=10001&campid=5338215070&icep_sellerId=&icep_ex_kw=&icep_sortBy=12&icep_catId=&icep_minPrice=&icep_maxPrice=&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg&icep_uq=',
					g: 'https://encrypted.google.com/search?q=',
					k: 'https://keep.google.com/?q=#search/text%3D',
					l: 'https://www.linguee.com/search?query=',
					lp: 'https://lpepfinder.com/#gsc.q=',
					m: 'https://www.google.com/maps/search/',
					osm: 'https://www.openstreetmap.org/search?query=',
					r4: 'https://radio4000.com/search?search=',
					tr: 'https://translate.google.com/?q=',
					w: 'https://en.wikipedia.org/w/index.php?search=',
					wa: 'http://www.wolframalpha.com/input/?i=',
					y: 'https://www.youtube.com/results?search_query=',
					'?': 'https://find.internet4000.com'
				}
			},
			'+': {
				name: 'do',
				engines: {
					r4: 'https://radio4000.com/add?url=',
					draw: 'https://docs.google.com/drawings/create?title=',
					doc: 'https://docs.google.com/document/create?title=',
					sheet: 'https://docs.google.com/spreadsheets/create?title=',
					gmail: 'https://mail.google.com/mail/#inbox?compose=new&title='
				}
			},
			'#': {
				name: 'command',
				fns: {
					add: function(app, arg) {
						let [symbol, id, url] = arg.split(" ");
						app.addEngine(
							app.getUserSymbols(),
							symbol,
							id,
							url)
					}
				}
			}
		},

		// add a new user engine
		// to the list of user defined engines in user symbols
		addEngine(symbols, symbol, engineId, url) {
			if(symbols[symbol]) {
				symbols[symbol].engines[engineId] = url;
				this.setUserSymbols(symbols)
			} else {
				console.error('symbol', symbol, 'does not exist in', symbols)
			}
		},

		// To get an engine url from its engine id,
		// also pass a list of symbols and a symbol
		getEngineUrl(symbols, symbol, engineId) {
			var symbolEngines = symbols[symbol]
			var engineUrl = symbolEngines.engines[engineId];
			return engineUrl
		},

		// returns a result url string to open
		// default to "search for help if only a symbol"
		buildResultUrl(userQuery, symbols = this.symbols, symbol = '!', engineId = 'd') {
			var app = this;

			// if symbol is fns, don't open url, but run the function
			if(symbol === '#') {
				var fns = symbols[symbol].fns[engineId]
				return fns(app, userQuery);
			}

			var engineUrl = this.getEngineUrl(symbols, symbol, engineId);
			return engineUrl + userQuery;
		},

		// is there a symbol in this symbol group? `!ex` return `!` !
		checkForSymbol(symbolGroup) {
			var availableSymbols = Object.keys(this.symbols),
					symbol = symbolGroup.charAt(0);

			return availableSymbols.indexOf(symbol) >= 0 ? symbol : false;
		},

		// is an engine available in a array of symbolGroups
		getSymbolsForEngine(symbolGroups, symbol, engineId) {
			if(!symbolGroups.length) return false;
			var filteredGroups = symbolGroups.filter(function(symbols) {
				if(!symbols || !symbols[symbol]) return false;
				var engines =	 symbols[symbol].engines;
				var fns =	 symbols[symbol].fns;
				if (engines) {
					return engines[engineId] ? true : false
				}
				if (fns) {
					return fns[engineId] ? true : false
				}

				return false;
			})
			if(!filteredGroups.length) return false
			return filteredGroups[0]
		},

		// param:
		// - userQuery: string `!m new york city`
		// return:
		// - url: string to be openned by the browser
		decodeUserRequest(userRequest) {
			if(!userRequest) { return false; }

			var requestTerms = userRequest.split(' '),
					requestSymbolGroup = requestTerms[0],
					requestSymbol = this.checkForSymbol(requestSymbolGroup),
					requestEngineId = requestSymbolGroup.slice(1),
					allSymbolGroups= [this.getUserSymbols(), this.symbols];

			// if there is no symbol, the whole userRequest is the query
			if (!requestSymbol) {
				return this.buildResultUrl(userRequest);
			}

			// is the engine referenced in the	userSymbols or symbols
			// let selectedSymbols = this.getRequestedSymbols(allSymbolGroups, requestSymbol, requestEngineId);
			var selectedSymbols = this.getSymbolsForEngine(allSymbolGroups, requestSymbol, requestEngineId);

			// if there are no selectedSymbols, we don't know the engine
			if (!selectedSymbols) {
				return this.buildResultUrl(userRequest);
			}


			// if we know the symbol and engine,
			// the actual query is everything but the request's engine group (the first group)
			var userRequestNoSymbol = requestTerms.splice(1, requestTerms.length).join(' ');
			return this.buildResultUrl(userRequestNoSymbol, selectedSymbols, requestSymbol, requestEngineId);
		},

		// check whether URL starts with a scheme
		checkUrl(url) {
			return url.startsWith("//") || url.includes("://");
		},

		openUrl(url) {
			// replace history state
			// so after transition, clicking the back button does not hit find/?q=search
			// that would transition again to a search result
			if(!url) return
			if (!this.checkUrl(url)) url = "//" + url;
			location.replace(url);
		},

		// takes a string, request query of a user
		find(request) {
			if(!request) return false;
			return this.openUrl(this.decodeUserRequest(request));
		},

		init() {
			var url = new URL(window.location.href);
			var request = url.searchParams.get('q');
			if(!request) return;
			this.find(request);
		},

		// generates new userSymbols from copying original symbols
		// to be used with Find default symbols (Find.symbols)
		newUserSymbols(fromSymbols) {
			var symbols = JSON.parse(JSON.stringify(fromSymbols))
			Object.keys(symbols).forEach(symbol => {
				symbols[symbol].engines = {}
				if(symbol === '#') {
					delete symbols[symbol]
				}
			})
			return symbols
		},

		// get the user symbols from local storage
		// or returns an empty new set of symbols
		getUserSymbols() {
			var storageSymbols;
			try {
				storageSymbols = JSON.parse(
					localStorage.getItem(this.localStorageKey)
				);
			} catch(e) {
				if(e.name === 'SyntaxError') {
					storageSymbols = null;
				}
			}

			if(!storageSymbols) {
				storageSymbols = this.newUserSymbols(this.symbols);
			}

			return JSON.parse(JSON.stringify(storageSymbols));
		},

		// saves a new set of user symbols to local storage
		setUserSymbols(newSymbols) {
			if (!newSymbols) return
			localStorage.setItem(this.localStorageKey, JSON.stringify(newSymbols))
		}
	}

	// write user documentation
	console.info(
		'Documentation: https://github.com/internet4000/find',
		"— Usage: Find.find('!m brazil')",
		"— Explore the Find object"
	)
	App.init()
	return App;
}));
