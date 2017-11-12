# Find!

Simply find what you want, where you know you'll find it.

## Setup

* Visit [find.hugurp.org](https://find.hugurp.org) with your favorite web browser
* Add this webpage as your search engine. Here is where how, with:
  * Firefox, click the magnifying glass icon (it has a green "+") in
the search bar, then click the `Add "Find!" button`. [Check if it
worked here](about:preferences#search), it should now appear in the
"One-click search engines" list. You can double click its `Keyword`
column to customize how it will be triggered, we recommand you to put
the letter `f` (short for "find").
  * For Chrome/Chromium, go to [the search engines settings
page](chrome://settings/searchEngines). In the "Other search engines"
section, click the "add" button. Add the search engine with the
following values: Seach engine: `Find`, Keyword: `f`, Query URL: `https://find.hugurp.org?q=%s`.


## Usage

By default, your search queries will go to
[DuckDuckGo](https://duckduckgo.com), "the search engine that doesn't
track you".

But all the idea with `Find!` is to use the following `keywords` as
search triggers:

| keyword | site                 |
| ---     | ---                  |
| a       | www.amazon.com       |
| c       | contacts.google.com  |
| ciu     | caniuse.com          |
| d       | duckduckgo.com       |
| dd      | devdocs.io           |
| dr      | drive.google.com     |
| g       | encrypted.google.com |
| lp      | lpepfinder.com       |
| m       | maps.google.com      |
| osm     | openstreetmap.org    |
| w       | en.wikipedia.org     |
| y       | www.youtube.com      |


To use these triggers, for exemple with the search query `foo`:
- Put your cursor in the URL bar of your browser
- Type the website's `keyword` (the website on which you want to
  search. ex: `y` for Youtube).
- After the keyword, add a `space` (just normally as in between two
  words), and type your *search query*, in this exemple we said
  `foo`
- At this point the URL bar should have this written in `y foo` (there
  is a space in between `y` and `foo`).
- Press `enter` (the return key), to validate your search.
- Now you should be on Youtube, with the search results for your
  search querry `foo`.

Note: in the exemple above `Find!` is considered to be your default
search engine. If it is not, and you use it as of Firefox's "one click
search engine", or Chrome/Chromium's "other search engine", you have
to follow the same steps as above but as a first step you need to
*trigger the search `Find!` search engine*.

## Configuration

Except the `keyword` you will use to trigger the search engine (we
recommand `f`), or setting `Find!` as your *default search engine* in
your web browser, there is no configuration.

In this case we think the [Convention over
configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)
moto makes a lot of sense, to start usage very quickly.


## Customization

No configuration does not mean you cannot customize your usage. Since
this software is [Free
software](https://en.wikipedia.org/wiki/Free_software), you can easily
deploy and customize your own instance.

Find the code on [Github](https://github.com/hugurp/find), and
customize as you want.

### Host your own instance 

You will have to change the following:

- in `opensearch.xml`, the line `<Url type="text/html"
  template="https://find.hugurp.org?q={searchTerms}"/>`, should be
  updated to reflect where you site will be hosted.

### How to add new search engine websites

Go to the website you would like to add, search for `foo` in the
search input, and wait for the search result to appear. Now copy the
URL of the search result page, and it should have `foo` in it (usually
after a parameter called `q`, or `query`, but it could be a different
pattern). Copy everything, from the `scheme://` to `foo` (excluded).

Now update the `searchEngines` Javascript `Object`
in the file `main.js`, with the URL you copied before (without `foo`).

It shoud look like this:

```
// `f` is the key that will trigger the site search, `!f`
// and between the `` is the site (to which you removed `foo`)
// of course all the websites you want should appear here

var searchEngines = {
  f: 'https://your-new-website.org/search?q=',
}
```

## Hosting

This website is hosted on [Netlify](https://www.netlify.com/), auto
deployed when new commits are pushed to the `master` branch of this
git repository. You can of course setup the same behavior.


## Privacy

No data is stored, audit the code. Therefore you can either use this
instance of the code, or host your own.


## License

This software uses the [GNU General Public License
v3](https://www.gnu.org/licenses/gpl.html).

## Improvement to this software

This version is a pure frontend version, written in Javscript. It is
super easy to host and deploy, but one of the downside is speed, even
though after the first visit the complete code is cached by the
browser. If a similar code were to be implement directly on a server,
there would be one less client request, but it would be less easy to
host and deploy.
