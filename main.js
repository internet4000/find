(function() {

	// site keyword : site URL
  var searchEngines = {
    d: 'https://duckduckgo.com/?q=',
    g: 'https://encrypted.google.com/search?q=',
    y: 'https://www.youtube.com/results?search_query=',
    dd: 'http://devdocs.io/#q='
  }

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
			// searchEngines.hasOwnProperty(siteKeyword) &&
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
	openSearchResults(userQuery.siteURL, userQuery.siteQuery);

	console.log('userQuery', userQuery);
})();
