import test from "ava";
import Find, { OpenSearchDescription } from "../../src/index.js";

const CONFIG_EXPORT = {
	shortName: "Find",
	description: "Find anything anywhere",
	image: "https://internet4000.github.io/find/assets/favicon.ico",
	templateHTML: "https://internet4000.github.io/find/#q={searchTerms}",
	templateXML: "https://internet4000.github.io/find/assets/opensearch.xml",
	templateSuggestionsJSON:
		"https://internet4000.github.io/find/api/suggestions/#q={searchTerms}",
};

const XML_EXPORT = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<InputEncoding>UTF-8</InputEncoding>
	<ShortName>Find</ShortName>
	<Description>Find anything anywhere</Description>
	<Image height="64" width="64" type="image/png">https://internet4000.github.io/find/assets/favicon.ico</Image>
	<Url type="text/html" template="https://internet4000.github.io/find/#q={searchTerms}" method="GET"/>
	<Url type="application/opensearchdescription+xml" rel="search" template="https://internet4000.github.io/find/assets/opensearch.xml" method="GET"/>
	<Url type="application/x-suggestions+json" rel="suggestions" template="https://internet4000.github.io/find/api/suggestions/#q={searchTerms}" method="GET"/>
</OpenSearchDescription>`;
/* <moz:SearchForm>https://internet4000.github.io/find/#q={searchTerms}</moz:SearchForm> */

test("OpenSearchDescription is in Find with a config", (t) => {
	t.like(Find.osd.config, CONFIG_EXPORT);
});
test("OpenSearch can export to JSON", (t) => {
	t.like(JSON.parse(Find.osd.exportJSON()), CONFIG_EXPORT);
});
test("OpenSearch can export to XML", (t) => {
	t.deepEqual(Find.osd.exportXML(), XML_EXPORT);
});
