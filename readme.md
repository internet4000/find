# Usage

On [internet4000.github.io/find](https://internet4000.github.io/find) it is possible to make queries to find.

# Installation

To run a new find instance:

## npm

Use the npm package [i4k-find](https://www.npmjs.com/package/i4k-find).

Check the `./index.html` file for how to import the package and the GUI.

## github fork

- fork this repository
- enable "pages from actions" in the settings
- run the "static.yml" workflow
- visit

# About

The URL bar of web-browsers is used to write text, websites adresses and search
queries. Find is a tool that offers a user the possibility to customize the
functionalities of any web-browser's browser URL bar
([omnibox][https://en.wiktionary.org/wiki/omnibox]).

It is similar to [DuckDuckGo bangs](https://duckduckgo.com/bangs), but runs only
in the user browser (only javascript client side code) and can be customized
with new search engines, and synchronised across devices using the native
browser's password manager (treating the user search engines custom
configuration as a passwrod for the instance of find you're using).

It aims to be a lightweight way to enhance the URL bar user-experience,
accesible to use and install a personal instance. Also, it is Free software, and can be
customized and hosted quickly at your convenience.

The fastest way to test its features, is by trying the example queries
on this page: [try Find! here](https://internet4000.github.io/find).

If you want to have the best experience, try it as your web browser's
default search engine; so all the features are accesible directly in
your URL bar (tip: focus it with `C-l`).

## Usage

Here are example usage of "user queries":

```
!osm tokyo
!gh linux
+wr
+wri
&gh
&gh internet4000
&gh internet4000 find
+sheet my new sheet
+draw hello world
```

> Type any of these in the find search input, or in your browser URL bar (when Find is one of your browser search engine).

## Documentation

Find more example and usages in the documention folder.

- the javascript file `src/index.js` contains all the code for I4kFind.
- the javascript file `src/ui/index.js` contains all the code for I4kFind web-components, composing the graphical user interface

> The web-components are only loaded after the find logic, if the user stays on
> the page (if there is no user query).

> Find does not have any production dependency, uses vanilla javascript, html
> and css code, that runs only in the user's browser tab.
