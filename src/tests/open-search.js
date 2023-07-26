import test from "ava";
import find, { I4kFind } from "../index.js";
import { OpenSearchDescription } from "../open-search.js"

const TEST_CONFIG = {
	shortName: "Find",
	description: "Find search",
	image: "https://example.local/test-find/assets/favicon.ico",
	templateHTML: "https://example.local/test-find/#q={searchTerms}",
	templateXML: "https://example.local/test-find/assets/opensearch.xml",
	templateSuggestions:
		"https://example.local/test-find/api/suggestions/#q={searchTerms}",
};

const TEST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<InputEncoding>UTF-8</InputEncoding>
	<ShortName>Find</ShortName>
	<Description>Find search</Description>
	<Image height="64" width="64" type="image/png">https://example.local/test-find/assets/favicon.ico</Image>
	<Url type="text/html" template="https://example.local/test-find/#q={searchTerms}" method="GET"/>
	<Url type="application/opensearchdescription+xml" rel="search" template="https://example.local/test-find/assets/opensearch.xml" method="GET"/>
	<Url type="application/x-suggestions+json" rel="suggestions" template="https://example.local/test-find/api/suggestions/#q={searchTerms}" method="GET"/>
</OpenSearchDescription>`;
/* <moz:SearchForm>https://example.local/test-find/#q={searchTerms}</moz:SearchForm> */

test("OpenSearch can export to JSON data", (t) => {
	const myOsd = new OpenSearchDescription({...TEST_CONFIG})
	t.like(JSON.parse(myOsd.exportJSON()), TEST_CONFIG);
});

test("OpenSearch can export to XML data", (t) => {
	const myOsd = new OpenSearchDescription({...TEST_CONFIG})
	t.deepEqual(myOsd.exportXML(), TEST_XML);
});
