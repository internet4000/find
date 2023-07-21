# Development (and deployment)
To deploy a new instance, work on new features, bug fixes, tests and
prototypes.

## Documentation

- the javascript file `src/index.js` contains all the code for I4kFind.
- the javascript file `src/ui/index.js` contains all the code for I4kFind web-components, composing the graphical user interface

> The web-components are only loaded after the find logic, if the user
> stays on the page (if there is no user query).

> Find does not have any production dependency, uses vanilla javascript, html
> and css code, that runs only in the user's browser tab.

## General
We don't need a development server to use locally.

1. get all the code (clone or download this repository)
1. open the index.html in a web browser

> With this method, refresh the pages after you make changes, to test
> them.

Alternatively, a node server for development and testing can be used. In this project's `package.json` file, are defined some script that can help us get started, run the following commands in a terminal shell:

- `npm install` to get the development dependencies (there are, and
  should be, no production dependencies)
- `npm start` to run the local server (it should say at which URL the
  page is locally available)
- There is no build system, to keep things small, simple and
  accessible; so the folder can be deployed as it is onto a web
  server, or after any change has been made (and we're satisfied with
  them).

All the Find logic code, is located in the folder `/src/index.js`. It
does not, and should not import other files.

Other files are configuration files for the continous
integration, testing, opensearch, hosting.

> Notes the URL's root `/` are the base of the find instance, or of the
> project folder depending on the context.

## NPM package
Find is available as a javascript es6 NPM module [!npm
i4k-find](https://www.npmjs.com/package/i4k-find).

### Install
In a new project use `npm instal i4k-find`
### Publish as a package
It uses a github workflow to run `npm publish` when a new tag is
created, for example `0.0.10`, which should match the value of the
`package.json.version` (and not already but published with this
version on npm).

## Deployment
There are diverse possibilities to deploy a new instance with a custom
Find, generally it will need the correct values for:

- `I4K_FIND_URL` environment variable, `https://example.org/my-find`

### github fork & actions (for own instance)
- fork this repository
- enable "pages from actions" in the settings
- customize the `I4K_FIND_URL` env var (it will try to default to the
  github pages deployment URL)
- run the "static.yml" workflow
- visit the fork's github page

### gitlab pages
- fork this repository on gitlab
- it should use the `pages` job/pipeline, that will deploy a new instance
## Testing
To run the tests, after having done `npm install` to get the initial
dependencies:
- run `npm run test`
- it will run test onces
- 

## Sync
Could try to auto sync user defined engines, by "submitting all
changes" to a hidden update-password-form, and submit it.

Maybe that would triger the browser/password-manager to update the password value for this site.

## URLs

The "base URL of the site" should of the format (window.location, with
no hash or search param, though if only look for one search param
value, `q` for user `query`):
- https://example.org/my-find/
- https://subdomain.example.org/my-find/
- https://subdomain.example.org/my-find/foo/
- https://0.0.0.0:4000/my-find/foo/

> These URLs can, or not, have a trailling slash `/`

There we can build these URLs for the user search query (if the param is customized to `my-custom-param`)
- https://example.org/my-find/#my-custom-param=my%20query
- https://subdomain.example.org/my-find/#my-custom-param=my%20query
- https://subdomain.example.org/my-find/foo/#my-custom-param=my%20query
- https://0.0.0.0:4000/my-find/foo/#my-custom-param=my%20query

## Open Search file generation
We're trying to (auto)generate an Open Search (Description) file, that
is corect for each deployment context. That way a user can clone/fork
the repo, setup the "one ENV var" (if we cannot get it in our
scripts), and the deployment && XML file (and all config) would be
correct.

The generation is done by the file `src/scripts/opensearch-xml.js`,
which can be called with the command `npm run opensearch`.

This should generate the correct `/opensearch.xml

## Open Search Suggestions API
The objective with this "web-worker client-side API", is to allow Find
to give feedback, directly in the URL bar, while typing.

### Usage
When installed as the default search engine, Find could offer
suggestions, since the browser is supposed to call the suggestions API
endpoint defined in the =opensearch.xml= file.

If the "find deployment page of your default search engine", has been
visited once, the web-worker.js is loaded, and can maybe execute code,
even while the tab is closed (as it has been register).

The function of the web-worker, is it catch (middle man), all queries
that are made (all change of characters in the input), and provide
suggestions of search results for the current user input value (in the
URL bar directly).

Find is setup to always get the data from the hash parameter, which is
the part of the URL that is not sent to the server.

If we open the browser developper tools, and inspect the network
requests made by a search query (from example in the UI search
input). We can see that no data goes to the server in the Headers or
in the Body of the request.

> Note: we should probably make a test with wireshark and tcpdump, and
> look at the output of the queries we make (in the browser, via all
> Find methods), to see if any data is leaking out of the browser tab,
> into internet/the-networks. Probably also check with a
> node/python/.. script, to see what their server's can catch from our
> requests. Also if the web-worker is not (yet) registered.

### References
- https://developer.mozilla.org/en-US/docs/Web/OpenSearch
- https://gist.github.com/eklem/453dea31bf92d7bf6564

### What to try
We're currently only generatig suggestions for the avaiable default
and user engines.

It would be nice to find a way to have a general, and specific methods
(for each symbol, engine etc.), to seart getting suggestions directly
from their content.

Maybe:
- use their opensearch file, if they have one, and we can get data
  there (make a search query to their search/suggestion endpoint?)
- 

## Visiting the find URL
It is visited each time a search is made.

We try to only execute the user query part of the script, and not load
any other file/assets, for speed.

So the UI part (web components), 
