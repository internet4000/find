# Find!

The URL bar of web-browsers is used to write websites adresses and
search queries. Find is a tool that offers a user the possibility to
customize these functionalities.

*Find!* aims to be a simple way to enhance the URL bar user
experience, easy to use and install. Also, it is Free software, and
can be customized and hosted quickly at your convenience.

The fastest way to test its features, is by trying the example queries
on this page: [try Find! here](https://find.internet4000.com).

If you want to have the best experience, try it as your web browser's
default search engine; so all the features are accesible directly in
your URL bar (tip: focus it with `C-l`).

> Note: the functionalities of the software are written in
> Javascript. All the code is in the `main.js` file and can be read in
> a few minutes. It is not minified when distributed to offer a
> possibility to be inspected freely. This software does not and
> should not store any user data.

A start to take control back over our inputs.

## Setup details

This section shows you how to make Find your default browser search
engine. Skip it for usage details.

There are two possible setups:

- self hosted, where you host your instance of Find. It is all
  javascript running in the browser, so it is easy to host anywhere
  for free, and instance for your usage. It is the best for privacy,
  so you're sure of where your search queries are going. To learn more
  about this, go to the `Host your own instance` paragraph in the
  `Customize` section bellow.
- use an instance hosted by someone else; this is the version
  proposed here, hosted from this repository to Netlify.
	
Overhall it is pretty easy, and is about making Find your default
search engine.

1. Visit [find.internet4000.com](https://find.internet4000.com) with your favorite web browser

2. Add this webpage as your search engine. Here is where how, with:
  
	* *Firefox*, click the magnifying glass icon (it has a green "+") in
the search bar, then click the `Add "Find!" button`. Check if it
worked in your preferences (`about:preferences#search`), `Find!`
should now appear in the "One-click search engines" list. You can
double click its `Keyword` column to customize how it will be
triggered, we recommand you to put the letter `f`, short for "find"
(if you do not use it as default search engine).
  
	* For *Chrome/Chromium*, go to its settings page
(`chrome://settings/searchEngines`); in the "Other search engines"
section, click the "add" button and use the following values:
```
Search engine: `Find`
Keyword: `f`
Query URL: `https://find.internet4000.com?q=%s`
```

3. Make the new Find search engine your default search engine.
4. Now you should be able to use the functionalities from your URL bar.

## Usage details

By default (if you don't use any `!` prefix, or if it is not used), your search queries will
go to [DuckDuckGo](https://duckduckgo.com), "the search engine that
doesn't track you".

> Note: it is possible and easy to change your default search
> engine. It is explained later, for example your could Write `#add !
> d https://encrypted.google.com/search?q={}` to make it Google

All the idea with `Find!` is to use the following **symbols** and
**engines** in your search.

### Symbols

Symbols offer a way to give semantic meaning to engines, to organize
what the engines do:
- `!` = search
- `+` = action
- `&` = build
- `#` = command (no custom engines)

If what you write in Find starts by one of these **symbols**, Find will
check the query to see if it contains an **engine**.
- if there are no engine, your query just goes to the default search
  engine
- if there is an engine, find will use it with your query

Let's see what engines are available for each symbols.

### Engines by Symbols

For an up-to date list of default engines by symbols, you can look at the
beginning of the `main.js` file. All the symbols and engines are
written the same way as in the following tables (but complete).

Alternatively, this project can come with a graphical user interface
to explore all available engines, as well as your custom engines (see
if you access the settings page in your instance).

#### ! search

- !a - amazon.com
- !c - contacts.google.com
- !ciu - caniuse.com
- !d - duckduckgo.com
- !dd - devdocs.io
- !dr - drive.google.com
- !g - encrypted.google.com
- !lp - lpepfinder.com
- !m - maps.google.com
- !osm - openstreetmap.org
- !w - en.wikipedia.org
- !y - youtube.com
- unknown keyword - !keyword and queries fallback to default search
  engine, duckduckgo
- nokeyword - search goes to default search engine, duckduckgo

#### + action
- +r4 [url] - radio4000.com add a new track from URL
- +draw [title] - open a new drawing in Google Drive Draw
- +doc [title] - open a new Google Docs document
- +sheet - open a new Google Spreadsheets document
- +gmail - open a new Gmail (Google Mail) email

#### & build
- gh [user] [repo] - github/[user]/[repo]
- gl [user] [repo] - gitlab/[user]/[repo]
- firebase [project] - firebase/[project]
- netlify [project] - netlify/[project]
- r4 [radio] - radio4000/[radio]
- r4p [radio] - radio4000/play/[radio]
- r4pr [radio] - radio4000/play/random/[radio]

#### # command
- #add \<name\> \<url\> - add a custom `!` search, e.g. `#add gh https://github.com/search?q=`

### Detailed usage

To use these triggers, for exemple with the search query `foo`:
- Put your cursor in the URL bar of your browser
- Type the website's `!keyword` (the website on which you want to
  search. ex: `!y` for Youtube), prefixed with a `!`.
- After the keyword, add a `space` (just normally as in between two
  words), and type your *search query*, in this exemple we said
  `foo`
- At this point the URL bar should have this written in `!y foo` (there
  is a space in between `!y` and `foo`).
- Press `enter` (the return key), to validate your search.
- Now you should be on Youtube, with the search results for your
  search querry `foo`.

Note: in the exemple above `Find!` is considered to be your default
search engine. If it is not, and you use it as one of Firefox's "one click
search engine", or Chrome/Chromium's "other search engine", you have
to follow the same steps as above but as a first step you need to
*trigger the search `Find!` search engine* ("Tab" key in Firefox /
"one space" in Chrome/ium, after writting the keyword).

## Customization

### Add new search engines and their keyword

1. Go to the website you would like to add and search for `foo` in the
search input.

2. Wait for the search result to appear and copy the URL of the search
result page, it should have `foo` in it (usually after a parameter
called `q`, or `query`, but it could be a different pattern). Copy
everything, from the `scheme://` to `foo` (excluded).

3. Update the `searchEngines` Javascript `Object`
in the file `main.js`, with the URL you copied before (without `foo`),
and select which keyword it should use.

Note that you can also use the information stored in the `.xml` file
possibly used by websites to define their `Open Search
Description`. To do that, inspect the HTML code of the site you want
to add and search for a HTML link tag with the folloing type:
`application/opensearchdescription+xml"`. The file it points to will
have the infortmation you are looking for in the `Url` XML tag.

### Host your own instance 

1. deploy and host the site on your server
2. edit the file `opensearch.xml`, the line `<Url type="text/html"
  template="https://find.internet4000.com?q={searchTerms}"/>`, should be
  updated to reflect where you site will be hosted.

## Hosting

This website (find.internet4000.com) is hosted by [Netlify](https://www.netlify.com/), auto
deployed when new commits are pushed to the `production` branch of this
git repository. 

## Privacy

This software does not collect any data, there are and should be no analytics
functionalities.

## License

This software uses the [GNU General Public License
v3](https://www.gnu.org/licenses/gpl.html), which makes it [Free
software](https://en.wikipedia.org/wiki/Free_software).

## Development, improvement to this software

This version is a pure frontend written in Javascript. It is super
easy to host and deploy, but one of the downside is speed, even though
after the first visit the complete code is cached by the browser.

If a similar code were to be implement directly on a server,
there would be one less client request, but it would be less easy to
host and deploy, and audit which information the server stores.

You don't need a development server to test and improve this software.
- get all the code (clone or download this repository)
- open the index.html in your web browser

Alternatively, a node server for development and testing can be used:
- `npm install` to get the development dependencies (there are and
  should be no production dependencies)
- `npm start` to run the local server

All the code is located in the file `main.js`. Other files are
configuration files for the continous integration, testing, opensearch,
hosting.

## Testing

- `npm test` runs tests once
- `npm run test-watch` open the testing interface and rerun on file change

Tests are located in the `cypress/integration` folder.

## Disclaimer

This project is a vague and general experiment on the possible
improvements to the URL bar user experiences. More generally to the
user input spaces with written terminal interactions, such as CLIs
(Command-line interfaces), the shell, dmenu, HTML inputs and search
bars. This project is also inspired by Chrome/Chromium's Omnibox TAB trigger, Firefox's
custom search UX (keyword + space) and DuckDuckGo's !bangs action.

Chrome/Chromium refers to it as the Omnibox. Omni, Latin prefix
for "all" or "every", since we use it to *input everything*.

Self host your instances, customize your keywords, try out new
semantics, organizations and logic. 

Hopefully it gives to control back to the user into what this URL bar
con do, and where the inputs go.
