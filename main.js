var App = {
  localStorageKey: "r4find",
  /* we can’t use localStorageKey here, because it’s undefined */
  userEngines: JSON.parse(localStorage.getItem("r4find")) || {},

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
				dd: 'https://devdocs.io/#q=',
				dr: 'https://drive.google.com/drive/search?q=',
				e: 'http://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_ff3=9&pub=5575347480&toolid=10001&campid=5338215070&icep_sellerId=&icep_ex_kw=&icep_sortBy=12&icep_catId=&icep_minPrice=&icep_maxPrice=&ipn=psmain&icep_vectorid=229466&kwid=902099&mtid=824&kw=lg&icep_uq=',
				g: 'https://encrypted.google.com/search?q=',
				k: 'https://keep.google.com/?q=#search/text%3D',
				l: 'https://www.linguee.com/search?query=',
				lbc: 'https://www.leboncoin.fr/annonces/offres/ile_de_france/occasions/?th=1&q=',
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
          let [name, url] = arg.split(" ");
          app.addUserEngine(name, url);
        }
      }
    }
	},

	// returns a result url string to open
	// default to "search for help if only a symbol"
	buildResult(userQuery, symbol = '!', engineId = 'd') {
		var symbol = this.symbols[symbol];

    if (symbol.fns) {
      return symbol.fns[engineId](this, userQuery);
    }

    var engineUrl = symbol.engines[engineId];
		return engineUrl + userQuery;
	},

	// is there a symbol in this query? return it!
	checkForSymbol(symbolGroup) {
		var availableSymbols = Object.keys(this.symbols),
				symbol = symbolGroup.charAt(0);

		return availableSymbols.indexOf(symbol) >= 0 ? symbol : false;
	},
	checkForEngine(symbol, engineId) {
    var engines =  this.symbols[symbol].engines;
    var fns =  this.symbols[symbol].fns;
		if (engines) {
      return engines[engineId] ? engineId : false;
    }

    if (fns) {
      return fns[engineId] ? engineId : false;
    }

    return false;
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

		// if there is no symbol, the whole userRequest is the query
		if (!symbol) {
			return this.buildResult(userRequest);
		}

		// check what is the requested engine
		var engineId = this.checkForEngine(symbol, requestSymbolGroup.slice(1));

		// if we don't know the engine, the whole request is passed as query
		if (!engineId) {
			return this.buildResult(userRequest);
		}

		// if we know the symbol and engine, build request
		// the actual query is everything but the request's engine group (the first group)
		var requestQuery = requestTerms.splice(1, requestTerms.length).join(' ');

		return this.buildResult(requestQuery, symbol, engineId);
  },

	// check whether URL starts with a scheme
	checkUrl(url) {
		return url.startsWith("//") || url.includes("://");
	},

	openUrl(url) {
		// replace history state
		// so after transition, clicking the back button does not hit find/?q=search
		// that would transition again to a search result
		if (!this.checkUrl(url)) url = "//" + url;
		location.replace(url);
	},

	// takes a string, request query of a user
	find(request) {
		if(!request) return;
		var url = this.decodeUserRequest(request);
		this.openUrl(url);
	},

	init() {
		this.refreshUserEngines();
		var url = new URL(window.location.href);
		var request = url.searchParams.get('q');
		window.onload= this.showCustoms.bind(this);
		if(!request) return;
		this.find(request);
	},

	addUserEngine(name, url) {
		this.userEngines[name] = url;
		localStorage.setItem(this.localStorageKey, JSON.stringify(this.userEngines));
		this.refreshUserEngines();
	},

	refreshUserEngines() {
		for (var name in this.userEngines) {
			var url = this.userEngines[name];
			this.symbols["!"]["engines"][name] = url;
		}
	},

	showCustoms() {
		var lst = document.getElementById("Customs-table");

		if(!lst) return;

		for (var name in this.userEngines) {
			var row = lst.insertRow(-1);
			var nameCell = row.insertCell(0);
			nameCell.innerHTML = name;
			var urlCell = row.insertCell(1);
			urlCell.innerHTML = this.userEngines[name];
			var deleteCell = row.insertCell(2);
			deleteCell.classList.add("Customs-deleter");
			deleteCell.innerHTML = "X";
			deleteCell.addEventListener("click", function() {
				delete this.userEngines[name];
				localStorage.setItem(this.localStorageKey, JSON.stringify(this.userEngines));
				this.openUrl(location.href);
			}.bind(this));
		}
	},
};

App.init();
