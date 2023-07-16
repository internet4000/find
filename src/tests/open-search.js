import test from "ava";
import Find, { OpenSearchDescription } from "../../src/index.js";

const CONFIG_EXPORT = {
	shortName: "Find",
	description: "Find anything anywhere",
	tags: "find now productivity search",
	contact: "internet4000.com",
	templateHTML: "https://internet4000.github.io/find/#q={searchTerms}",
	templateXML: "https://internet4000.github.io/find/opensearch.xml",
	image:
		"https://internet4000.github.io/find/public/favicons/favicon-32x32.png",
	longName:
		"Customize the browser omnibox URL bar with custom search engines and actions",
	exampleSearchTerms: "test",
	developer: "Internet4000",
	attribution: "public domain",
	syndicationRight: "open",
	adultContent: "false",
	language: "en-us",
	outputEncoding: "UTF-8",
	inputEncoding: "UTF-8",
};

const XML_EXPORT = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<ShortName>Find</ShortName>
	<Description>Find anything anywhere</Description>
	<Tags>find now productivity search</Tags>
	<Contact>internet4000.com</Contact>
	<Url type="text/html" template="https://internet4000.github.io/find/#q={searchTerms}" />
	<Url type="application/opensearchdescription+xml" rel="self" template="https://internet4000.github.io/find/opensearch.xml" />
	<Image height="64" width="64" type="image/png">https://internet4000.github.io/find/public/favicons/favicon-32x32.png</Image>
	<LongName>Customize the browser omnibox URL bar with custom search engines and actions</LongName>
	<Query role="example" searchTerms="test" />
	<Developer>Internet4000</Developer>
	<Attribution>public domain</Attribution>
	<SyndicationRight>open</SyndicationRight>
	<AdultContent>false</AdultContent>
	<Language>en-us</Language>
	<OutputEncoding>UTF-8</OutputEncoding>
	<InputEncoding>UTF-8</InputEncoding>
</OpenSearchDescription>`;

test("OpenSearchDescription is in Find with a config", (t) => {
	t.like(Find.osd.config, CONFIG_EXPORT);
});
test("OpenSearch can export to JSON", (t) => {
	console.log(Find.osd.exportJSON(), JSON.stringify(CONFIG_EXPORT));
	t.like(JSON.parse(Find.osd.exportJSON()), CONFIG_EXPORT);
});
test("OpenSearch can export to XML", (t) => {
	t.deepEqual(Find.osd.exportXML(), XML_EXPORT);
});
