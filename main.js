var App = {
	searchEngines: {
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
  },
	decodeUserQuery(userQuery) {
    if(!userQuery) { return }

		var regexBang = /^!/,
				siteURL,
				siteQuery,
				siteKeyword,
				terms = userQuery.split(' ');

    if(!new RegExp(regexBang).test(terms[0])) {
			return {
				siteURL: this.searchEngines.d,
				siteQuery: userQuery
			};
    } else {
			siteKeyword = terms[0].replace(regexBang, '');

			if(this.searchEngines.hasOwnProperty(siteKeyword)) {
				siteURL = this.searchEngines[siteKeyword];
				siteQuery = terms.splice(1, terms.length).join(' ');
			} else {
				siteURL = this.searchEngines.d;
				siteQuery = userQuery;
			}
			return {
				siteURL: siteURL,
				siteQuery: siteQuery
			};
		}
  },

	openSearchResults(siteURL, siteQuery) {
		window.open(siteURL + siteQuery, '_self');
	},

	find(query) {
		if(!query) return;
		var decodedUserQuery = this.decodeUserQuery(query);
		console.log('decodedUserQuery', decodedUserQuery);
		this.openSearchResults(decodedUserQuery.siteURL, decodedUserQuery.siteQuery);
	},

	init() {
		var url = new URL(window.location.href);
		var query = url.searchParams.get('q');
		if(!query) return;
		this.find(query);
	}
};

App.init();
