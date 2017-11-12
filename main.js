(function() {

	/*
		 searchEngines: Object { keyword: 'site open search template'}
	 */
  var searchEngines = {
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
		tr: 'https://translate.google.com/#auto/#auto/',
		w: 'https://en.wikipedia.org/w/index.php?search=',
		wa: 'http://www.wolframalpha.com/input/?i=',
    y: 'https://www.youtube.com/results?search_query=',
  };

  function getURLParameter(name) {
    var param = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''];
    return decodeURIComponent(param[1].replace(/\+/g, '%20')) || null;
  }

  function decodeUserQuery(userQuery) {
    if(!userQuery) { return }

		var regexBang = /^!/,
				siteURL,
				siteQuery,
				siteKeyword,
				terms = userQuery.split(' ');

    if(!new RegExp(regexBang).test(terms[0])) {
			return {
				siteURL: searchEngines.d,
				siteQuery: userQuery
			};
    } else {
			siteKeyword = terms[0].replace(regexBang, '');

			if(searchEngines.hasOwnProperty(siteKeyword)) {
				siteURL = searchEngines[siteKeyword];
				siteQuery = terms.splice(1, terms.length).join(' ');
			} else {
				siteURL = searchEngines.d;
				siteQuery = userQuery;
			}
			return {
				siteURL: siteURL,
				siteQuery: siteQuery
			};
		}
  }

	function openSearchResults(siteURL, siteQuery) {
		window.open(siteURL + siteQuery, '_self');
	}

  /*
		 Decode user query then open the site
	 */
	var decodedUserQuery = decodeUserQuery(getURLParameter('q'));
	if(!decodedUserQuery) { return };
	console.log('decodedUserQuery', decodedUserQuery);
	openSearchResults(decodedUserQuery.siteURL, decodedUserQuery.siteQuery);
})();
