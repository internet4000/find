# Find!
Find (`I4kFind`) is a privacy friendly, client side, local/URL first
toolkit, to customize a web browser's URL Omnibox (the search/address
bar).

> There are more examples of usages, and development notes in the
> [./docs](./docs/) folder.

It _does not need to be installed as a browser extension or addon_,
though the UX feels more fluid when used as "default search engine"
(can be self hosted, but does not need to in order to be customized).

It does not make any search request itself, "just builds URLs" of
_specialized websites_, to which is passed the user's "search query"
(it could also be the value of URL parameters of any destination
application).



- makes a "normal search" by default (or if no Find syntax has been
  found), as usual in browser's URL bar.
- choose _on which search engine to search_, web search (default), map
  position (`!m`), contacts (`!c`), wikipedia (`!w`) new spreadhseet
  (`+sheet`) or matrix join chat link `&mx @user:domain.tld`, or
  RTCPeerConnection to `&rtcmx @user:domain.tld`) etc.
- DuckDuckGo also supports Bangs!, which will then be used if Find
  does not know a "search `!` engine"; ex: `!def find` (will will
  delegate the to DDG, which knows what to do with `!def`)
- save "user defined URLs" as engine(s) (a sort of "bookmark"), to be
  re-accessed from their "shortcode", `!ex` → `https://example.org`
- "route" the user query (with arguments), to any website
  (application), by building its URL
- build (custom) "destination URL" from patterns and placeholders
  `https://example.org/my-app/{}/?query={}` (no support for named
  placeholders yet)
- URL utilility, build URIs, "data URL" (ex: `data:text/html,<h1>Hello
  world</h1>`), to copy/share/edit/store temporary data, in various
  formats
- "pipe" outputs of other web-apps together, by their "(URL) outputs"
- re-assign and customize the syntax, engines URLs and actions (under
  the exisiting symbols); so it is the "user's favorite
  applications/sites" that are used by default
- synchronize between device(s) and browsers, without additional user
  account (export/import to JSON, save as "site credentials", in JSON,
  and optionally synchronize with the user/browser's password manager)
- host a custom instance (with CI/CD or drag and drop), implemented in
  vanilla HTML/CSS/Javascript(web-components), with no dependency and
  no build-system (could be implemented with wasm or other tools)
- define a new custom/local/browser-based "[open
  search](https://opensearch.org/)" engine
- "locally self hosted", with the web interface (`git clone`, `npm i
  && npm run serve`, open `https://localhost?q=%s`, should be
  discoverable as browser "open search engine"; and could use a
  different "suggestion API")
- (experiemental) get typing _suggestions_ from a client side API
  (web-worker following the OpenSearchDescription suggestion
  specification, catching "fetch queries" made to its own domain
  (`window.location/api/suggestions/`))
- as an accessible _starting template_ to experiment with what can the
  browser URL can be used for, and how to _interpret_ and _execute_
  queries, manage user defined data, syntax, functions
- test/explore/save other aplication(s) "URL params", connect them
  together, transform their output(s)
- customize a user browser's starting page, default new tab, homepage,
  HTML input and text string encoding/decoding/evaluation

# Usage
On [internet4000.github.io/find](https://internet4000.github.io/find)
it is possible to make queries to Find, such as `!docs usage` which
will redirect the browser page, to this document (to the link with
`#usage`).

For additional usages see the [documentation](./docs/) folder.

# How
Find is opened by the browser, as a search engine, with the query
typed by the user in their web-browser's URL bar (or from a query
inside a `<i4k-find-search/>` web-component, or a call to
`Find.find("my query")` etc.).

From the query, it will try to look for "the pattern it knows", to see
it the user typed a Find query, if there are none, it will default to
seaching, like a usual web-search, to the user's default search engine
(to be defined by the user)

# Help
For community chat and support, see the
[#i4k-find:matrix.org](https://matrix.to/#/#i4k-find:matrix.org) room,
or the [git issues](https://github.com/internet4000/find/issues), as
you see fit. Feedback, bug reports, engine/symbol/feature requests,
suggestions welcome.

# Install
It is possible to use Find with
- the default find instance website
- a personal find instance website (can customize more)

## As a browser search engine
In general, the UX should feel nicer when any instance is defined as
the default web browser's search engine. Otherwise it is also possible
to use a browser search engine keyword (still need to install a Find
instance as a search engine in the browser, but no need to defined as
the default one, as long as it has a keyword, which has to be prefixed
to every find query).

## As a npm package
1. use the npm package [i4k-find](https://www.npmjs.com/package/i4k-find).
1. check the `./index.html` file for how to import the package and the GUI.
1. customize the `assets/opensearch.xml` file for the new instance URL and information

It should be also available through a CDN: [!cdn
i4k-find](https://internet4000.github.io/find/#q=!cdn%20i4k-find) to
import.

# About
The URL bar of web-browsers is used to write text, websites adresses
and search queries. Find is a tool that offers a user the possibility
to customize the functionalities of any (device) web-browser's [URL
Address Bar](https://en.wikipedia.org/wiki/Address_bar) (aka the
[omnibox](https://en.wiktionary.org/wiki/omnibox)).

It is similar (and a lighweight, self-hostable, customizable, free
software alternatieve) to [DuckDuckGo
bangs](https://duckduckgo.com/bangs), and runs only in the user
browser.

The code is javascript running client side, and can be customized with
new search engines, synchronised across devices using the native
browser's password manager (treating the user search engines custom
configuration as a passwrod for the instance of find you're using).

It aims to be a lightweight way to enhance the URL bar, the
[URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
building user-experience, accesible to use and install on personal
instance(s).

It is Free software that can be customized and hosted quickly at your
convenience.

The fastest way to try its features, is by testing it with the example
queries on this page: [try Find!
here](https://internet4000.github.io/find).

If you want to have the best experience, try it as your web browser's
default search engine; so all the features are accesible directly in
your URL bar (tip: focus the omnibox with the keyboard shortcut
`Control + l`, the keys `Control` and the lowercase letter `L`, aka
`C-l` ).


## Examples
By default, a Find search query, goes to the default search engine
(`!d`) in our case, [duckduckgo](https://duckduckgo.com), and it is
possible to re-assign the "default search engine's value".

Here are example usage of _user queries_, one can type in an input
supporting _Find queries_ (such as [the one on the
homepage](https://internet4000.github.io/find)). A Find search input
will try to suggest the available symbols (`!&+#`) and their
associated engines.

> In the examples, lines prefixed with `;;` are comments, with `;;→`
> outputs URL or Find queries.

Example `search` with `!` symbol:

```txt
;; "default search", without anything "Find related"
Hello world
;;→ https://duckduckgo.com/?q=hello+world

;; A "map" search, defaults to google map (can be re-assigned to open street map etc.)
!m egypt
;;→ https://www.google.com/maps/search/egypt
```

Example `build` with `&` symbol:
```
;; go to, or buid a github profile/actor url
&gh
;;→ https://github.com

&gh internet4000
;;→ https://github.com/internet4000

&gh internet4000 find
... and more (all customizable)

;; to build a "matrix link to room/user" URL
&mx #i4k-find:matrix.org
;;→ https://matrix.to/#/%23i4k-find%3Amatrix.org
```

Example `do` with `+` symbol:

> Type any of these in a Find search input, or in your browser URL bar
> (if Find is one of your browser search engine).

```text
;; create a new google spreadsheet (with a title)
+sheet my new sheet

;; make a drawing
+draw 

;; take a note
+note My note content

;; create temporary "URL space" with text/|data
+space my data

;; create a "data json url" value
;; can be copied again to a new URL, stored as bookmark etc.
+data-json {"my-json": true}
```

Example `command` with the `#` symbol prefix (functions cannot
currently be user defined, only the other exisiting symbols):

```txt
;; to "save" an engine as a new "user defined engine" (userEngines)
#add ! ex https://example.org/
;;→ will save this URL, can be called as !ex

;; to add a new engine, with URL placeholders
#add ! ex https://example.org/blog/{}
;;→ will save this URL, can be called as !ex <blog-article-id>

;; to add a new "buid" engine, with URL placeholders
#add & ghi https://github.com/internet4000/{}
;;→ will save this URL, can be called as &ghi find (to reach the project)
```

## Why
Some reasons why this project exists:
- gain (self) control of where search queries go after leaving the
web-browser.
- experiement with what can be done from typing into any browser's URL
  (is the current cursor in a URL bar, a text search input, a REPL, a
  notebook? Or it is just me typing on the keyboard?)
- try to handle "not just search"
- explore using the different URI/URL(s) outputed by the "user/Find
   search queries", by the output(s) of the "web-app/sites" they
   serve, and what the user is intending to do
- share practical and nice URL(s) (`+wr` and `+wri` for serendipity,
  placeholders)
- interacting with computing interface(s) (url, shell, repl, notes,
  chats, links) and other actors

Some reasons why duckduckgo is the default search engine:
- it supports `!` [bangs](https://duckduckgo.com/bangs) (13,563+
  bangs! search engines)
- it seems more privacy friendly that the rest (that support bangs;
  are there any other?)

Cons:
- seems to "re-writte" the search results when you visit the search
  result page, again, after visiting a first result's page

# License
The code of this software uses the [GNU General Public License
v3](https://www.gnu.org/licenses/gpl.html), which makes it [Free
software](https://en.wikipedia.org/wiki/Free_software) (see
`/license.txt`).
