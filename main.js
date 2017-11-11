(function() {

  console.log('Find now!')
  
  // 1.
  // get the value url parameter `find` on page load
  // transition page to duckduckgo with the value as search
  // 2.
  // before first space is a shortcode for the website to be searched on
  // ex: `d test` = search `test` on duckduckgo, `g.uk test` = search `test` on google.co.uk

  // https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript
  function getURLParameter(name) {
    var param = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)|| [null, '']
    return decodeURIComponent((param)[1].replace(/\+/g, '%20')) || null;
  }

  function findQuery(query) {
    if(!query) return
    window.open('https://duckduckgo.com/?q=' + query, '_self');
  }

  findQuery(getURLParameter('q'))
  
})();
