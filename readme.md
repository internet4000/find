# Find!

Simply find what you want, where you know you'll find it.

The URL bar of modern web browsers is a place we write many things. We
write websites we want to access, or search queries that should help
us find what we're looking for.

Overhall we use it as a CLI (command line interface) to complete
actions on the web. In Chrome/Chromium, Google calls it the
Omnibox. Omni, the Latin prefix meaning "all" or "every", since we use
it to *input everything*.

*Find!* aims to be a simple way to enhance your experience, easy to
setup and use. Also, it is Free software, and can be customized and
hosted at your convenience.

The fastest way to start is to make it your web browser's
default search engine; then everything happens in your URL bar.

[Try Find! here](https://find.internet4000.com).

Continue reading for more details.

## Disclaimer

This project is inspired by Chrome/Chromium's Omnibox TAB trigger, Firefox's
custom search UX (keyword + space) and DuckDuckGo's !bangs action.
So nothing revolutionary here but you can self host your instance and
customize your keywords (!bang), and you won't have to set up custom
search engines in your browser ever again.
Cheers

## Setup details

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

3. Search using `!` prefixes in your browser's URL bar.

## Usage details

By default (if you don't use any `!` prefix, or if it is not used), your search queries will
go to [DuckDuckGo](https://duckduckgo.com), "the search engine that
doesn't track you".

But all the idea with `Find!` is to use the following `!keywords`
*prefixes as search triggers*:

| Search keyword  | site                                            |
| ---             | ---                                             |
| !a              | amazon.com                                      |
| !c              | contacts.google.com                             |
| !ciu            | caniuse.com                                     |
| !d              | duckduckgo.com                                  |
| !dd             | devdocs.io                                      |
| !dr             | drive.google.com                                |
| !g              | encrypted.google.com                            |
| !lp             | lpepfinder.com                                  |
| !m              | maps.google.com                                 |
| !osm            | openstreetmap.org                               |
| !w              | en.wikipedia.org                                |
| !y              | youtube.com                                     |
| unknown keyword | the !keyword and queries fallback to duckduckgo |
| no keyword      | search goes to duck duck go                     |

| Action keyword  | site                                            |
| ---             | ---                                             |
| +r4 [url]       | radio4000.com add a new track from URL          |
| +draw [title]   | open a new drawing in Google Drive Draw         |
| +doc [title]    | open a new Google Docs document                 |
| +sheet          | open a new Google Spreadsheets document         |
| +gmail          | open a new Gmail (Google Mail) email            |

| Function keyword      | site                                            |
| ---                   | ---                                             |
| #add \<name\> \<url\> | add a custom `!` search, e.g. `#add gh https://github.com/search?q=` |

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

## Configuration

Except the `keyword` you will use to trigger the search engine, or
setting `Find!` as your *default search engine* in your web browsers,
there is no configuration.

In this case we think the ["convention over
configuration"](https://en.wikipedia.org/wiki/Convention_over_configuration)
moto makes a sense, to start usage quickly.

## Customization

To customize your usage, deploy your own instance. Find the code on
[Github](https://github.com/internet4000/find), and customize as you want.

### Host your own instance 

1. deploy and host the site on your server
2. edit the file `opensearch.xml`, the line `<Url type="text/html"
  template="https://find.internet4000.com?q={searchTerms}"/>`, should be
  updated to reflect where you site will be hosted.

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

## Hosting

This website is hosted on [Netlify](https://www.netlify.com/), auto
deployed when new commits are pushed to the `master` branch of this
git repository. You can of course setup the same behavior easily.

## Privacy

No data is stored, audit the code. Therefore you can either use this
instance of the code, or host your own.

## License

This software uses the [GNU General Public License
v3](https://www.gnu.org/licenses/gpl.html), which makes it [Free
software](https://en.wikipedia.org/wiki/Free_software).

## Improvement to this software

This version is a pure frontend written in Javascript. It is super
easy to host and deploy, but one of the downside is speed, even though
after the first visit the complete code is cached by the browser.

If a similar code were to be implement directly on a server,
there would be one less client request, but it would be less easy to
host and deploy, and audit which information the server stores.

## Testing

- `npm test` runs tests once
- `npm run test-watch` open the testing interface and rerun on file change

Tests are located in the `cypress/integration` folder.

