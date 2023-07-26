export const DEFAULT_OSD = {
	shortName: "Find",
	description: "Find Search",
	image: "https://example.org/i4k-find/assets/favicon.ico",
	templateHTML: "https://example.org/i4k-find/#q={searchTerms}",
	templateXML: "https://example.org/i4k-find/assets/opensearch.xml",
	templateSuggestions: "https://example.org/i4k-find/api/suggestions/#q={searchTerms}",
};

/* generate the OSD needed to register as a browser search engine */
export class OpenSearchDescription {
	get attributes() {
		return [
			"shortName",
			"description",
			"templateHTML",
			"templateXML",
			"templateSuggestions",
			"image",
		];
	}
	get config() {
		return this.attributes.reduce((acc, val) => {
			acc[val] = this[val];
			return acc;
		}, {});
	}
	constructor(config) {
		this.attributes.forEach((attr) => {
			const isSet = config.hasOwnProperty(attr);
			const val = isSet ? config[attr] : DEFAULT_OSD[attr];
			this[attr] = val;
		});
	}
	exportJSON() {
		return JSON.stringify({ ...this.config }, null, 2);
	}
	exportXML() {
		const config = { ...this.config };
		return `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
	<InputEncoding>UTF-8</InputEncoding>
	<ShortName>${config.shortName}</ShortName>
	<Description>${config.description}</Description>
	<Image height="64" width="64" type="image/png">${config.image}</Image>
	<Url type="text/html" template="${config.templateHTML}" method="GET"/>
	<Url type="application/opensearchdescription+xml" rel="search" template="${config.templateXML}" method="GET"/>
	<Url type="application/x-suggestions+json" rel="suggestions" template="${config.templateSuggestions}" method="GET"/>
</OpenSearchDescription>`;
		/* <moz:SearchForm>${config.templateHTML}</moz:SearchForm> */
	}
}
