import test from "ava";
import find, { I4kFind } from "../index.js";
import { OpenSearchDescription } from "../open-search.js"
import openSearchXml from '../scripts/opensearch-xml.js'

const TEST_JSON = {
	shortName: "Find",
	description: "Find search",
	image: "https://test.local/my-other-find/assets/favicon.ico",
	templateHTML: "https://test.local/my-other-find/#q={searchTerms}",
	templateXML: "https://test.local/my-other-find/assets/opensearch.xml",
	templateSuggestions:
		"https://test.local/my-other-find/api/suggestions/#q={searchTerms}",
};

const TEST_XML = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<InputEncoding>UTF-8</InputEncoding>
	<ShortName>Find</ShortName>
	<Description>Find search</Description>
	<Image height="64" width="64" type="image/png">https://test.local/my-find/assets/favicon.ico</Image>
	<Url type="text/html" template="https://test.local/my-find/#q={searchTerms}" method="GET"/>
	<Url type="application/opensearchdescription+xml" rel="search" template="https://test.local/my-find/assets/opensearch.xml" method="GET"/>
	<Url type="application/x-suggestions+json" rel="suggestions" template="https://test.local/my-find/api/suggestions/#q={searchTerms}" method="GET"/>
</OpenSearchDescription>`;

test.afterEach(() => {
	process.env.I4K_FIND_URL = '';
})

test("Not setting I4K_FIND_URL screams error", async (t) => {
	process.env.I4K_FIND_URL = '';
	t.throws(() => {
		await openSearchXml()
	});
})

test("Setting I4K_FIND_URL generates the OpenSearch XML", async (t) => {
	process.env.I4K_FIND_URL = 'https://test.local/my-find';
	const osdXml = await openSearchXml()
	t.deepEqual(osdXml, TEST_XML);
})

test("Setting I4K_FIND_URL generates the OpenSearch JSON", async (t) => {
	process.env.I4K_FIND_URL = 'https://test.local/my-other-find';
	const osdJson = await openSearchJson()
	t.deepEqual(osdJson, TEST_JSON);
})
