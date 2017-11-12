(function() {

	/*
		 searchEngines: Object { keyword: 'site open search template'}
	 */
  var searchEngines = {
		a: 'https://www.amazon.com/s/field-keywords=',
		c: 'https://contacts.google.com/search/',
		ciu: 'https://caniuse.com/#search=',
    d: 'https://duckduckgo.com/?q=',
		dd: 'http://devdocs.io/#q=',
		dr: 'https://drive.google.com/drive/search?q=',
    g: 'https://encrypted.google.com/search?q=',
		lp: 'https://lpepfinder.com/#gsc.q=',
		m: 'https://www.google.com/maps/search/',
		osm: 'https://www.openstreetmap.org/search?query=',
		w: 'https://en.wikipedia.org/w/index.php?search=',
    y: 'https://www.youtube.com/results?search_query=',
  };

  function getURLParameter(name) {
    var param = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''];
    return decodeURIComponent(param[1].replace(/\+/g, '%20')) || null;
  }

  function decodeUserQuery(userQuery) {
    if(!userQuery) { return }

		var siteQuery,
				regexBang = /^!/,
				siteKeyword,
				siteURL,
				terms = userQuery.split(' ');

    if(terms.length > 1 && new RegExp(regexBang).test(terms[0])) {
			siteKeyword = terms[0].replace(regexBang, '');
      siteURL = searchEngines[siteKeyword] || null;
			siteQuery = terms.splice(1, terms.length).join(' ');
    } else {
			siteQuery = userQuery;
		}

		return {
			siteURL: siteURL || null,
			siteQuery: siteQuery
		};
  }

	function openSearchResults(siteURL, siteQuery) {
		if(!siteURL) {
			siteURL = searchEngines.d;
		}
		window.open(siteURL + siteQuery, '_self');
	}

  // start
	var userQuery = decodeUserQuery(getURLParameter('q'));
	if(!userQuery) { return };
	openSearchResults(userQuery.siteURL, userQuery.siteQuery);

	console.log('userQuery', userQuery);
})();
