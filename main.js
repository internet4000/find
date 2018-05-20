var App = {
	doEngines: {
		r4: 'https://radio4000.com/add?url='
	},
	symbols: {
		'!': {
			name: 'search',
			engines: {
				a: 'https://www.amazon.com/gp/search?tag=internet4000-20&keywords=',
				c: 'https://contacts.google.com/search/',
				ciu: 'https://caniuse.com/#search=',
				d: 'https://duckduckgo.com/?q=',
				dd: 'http://devdocs.io/#q=',
				dr: 'https://drive.google.com/drive/search?q=',
				e: 'http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=9&pub=5575347480&toolid=10001&campid=5338215070&icep_sellerId=&icep_ex_kw=&icep_sortBy=12&icep_catId=&icep_minPrice=&icep_maxPrice=&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg&icep_uq=',
				g: 'https://encrypted.google.com/search?q=',
				k: 'https://keep.google.com/?q=#search/text%3D',
				l: 'https://www.linguee.com/search?query=',
				lbc: 'https://www.leboncoin.fr/annonces/offres/ile_de_france/occasions/?th=1&q=',
				lp: 'https://lpepfinder.com/#gsc.q=',
				m: 'https://www.google.com/maps/search/',
				osm: 'https://www.openstreetmap.org/search?query=',
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
				r4: 'https://radio4000.com/add?url='
			}
		}
	},

	// returns a result url stirng to open
	// default to "search for help if only a symbol"
	buildResult(userQuery, symbol = '!', engineId = 'd') {
		var engineUrl = this.symbols[symbol].engines[engineId];
		return engineUrl + userQuery;
	},

	// is there a symbol in this query? return it!
	checkForSymbol(symbolGroup) {
		var availableSymbols = Object.keys(this.symbols),
				symbol = symbolGroup.charAt(0);

		return availableSymbols.indexOf(symbol) >= 0 ? symbol : false;
	},
	checkForEngine(symbol, engineId) {
		return this.symbols[symbol].engines[engineId] ? engineId : false;
	},

	// param:
	// - userQuery: string `!m new york city`
	// return:
	// - url: string to be openned by the browser
	decodeUserRequest(userRequest) {
    if(!userRequest) { return false; }

		var requestTerms = userRequest.split(' '),
				requestSymbolGroup = requestTerms[0],
				symbol = this.checkForSymbol(requestSymbolGroup);

		// we don't know the symbol, the whole request is the query
		if (!symbol) {
			return this.buildResult(userRequest);
		}

		// if there is a symbol, there is a requested engine following
		var engineId = this.checkForEngine(symbol, requestSymbolGroup.slice(1));

		// otherwise the query is everything but
		// the request's engine group (the first group)
		var requestQuery = requestTerms.splice(1, requestTerms.length).join(' ');

		return this.buildResult(requestQuery, symbol, engineId);
  },

	openUrl(url) {
		window.open(url, '_self');
	},

	// takes a string, request query of a user
	find(request) {
		if(!request) return;
		var url = this.decodeUserRequest(request);
		console.log('Opening url', url);
		// this.openUrl(url);
	},

	init() {
		var url = new URL(window.location.href);
		var request = url.searchParams.get('q');
		if(!request) return;
		this.find(request);
	}
};

App.init();
