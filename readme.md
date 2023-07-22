About Find! (I4kFind, find, F!) URL and local first vanilla web app.

> Find more examples and usages, and development notes in the
> [./docs](./docs/) documention folder.

# Usage
On [internet4000.github.io/find](https://internet4000.github.io/find)
it is possible to make queries to Find, such as `!docs usage` which
will redirect the browser page, to this document (to the link with
`#usage`).

Find allows building URLs, linking to things avaiable as URIs in
web-browsers, customizing what the omnibar can do, with code only
running on the client side (as a website, with javascript).

# How it works
Find can intercept the user search query (also in the browser URL
omnibar), and "decrypt the search query", with a predefined, and
extensible syntax (that should fit URI schemes).

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

## Example usage
Here are example usage of "user queries", one can type in an input
supportin Find queries (such as the one on the homepage).

```txt
!osm tokyo
!gh linux
+wr
+wri
&gh
&gh internet4000
&gh internet4000 find
+sheet my new sheet
+draw hello world
... and more (all customizable)
```

> Type any of these in a Find search input, or in your browser URL bar
> (if Find is one of your browser search engine).
