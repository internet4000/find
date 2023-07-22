import test from "ava";
import Find, { I4kFindSymbols } from "../../src/index.js";

const DEFAULT_SYMBOLS = new I4kFindSymbols().default

if (!globalThis.localStorage) {
	globalThis.localStorage = {
		getItem(key) {
			return this.storage[key];
		},
		setItem(key, val) {
			this.storage = { ...this.storage, [key]: val };
		},
		storage: {},
	};
}

// cleanup initial possible values from URL
test.afterEach(() => {
	window.location = new URL("i4k-find://");
});

test("find has initial symbols", (t) => {
	t.like(DEFAULT_SYMBOLS["!"], Find.symbols["!"]);
	t.like(DEFAULT_SYMBOLS["+"], Find.symbols["+"]);
	t.like(DEFAULT_SYMBOLS["&"], Find.symbols["&"]);
});

test("find has initial command symbol with dns", (t) => {
	Object.entries(DEFAULT_SYMBOLS["#"].fns).forEach(([fnId, fnDef]) => {
		t.truthy(Find.symbols["#"].fns[fnId])
		t.is(
			DEFAULT_SYMBOLS["#"].fns[fnId].toString(),
			Find.symbols["#"].fns[fnId].toString()
		)
	})
});

test("Find.find() only works if with a string argument", (t) => {
	t.falsy(Find.find());
	t.falsy(Find.find(""));
	t.is(Find.find("foo"), "https://duckduckgo.com/?q=foo");
});

test("find builds correct URL from search queries", (t) => {
	const queryResultPairs = [
		// empty search
		["", undefined],

		// a search with initial spaces, is not modified
		["    ", "https://duckduckgo.com/?q=%20%20%20%20"],

		// some of the symbols
		["!m brazil", "https://www.google.com/maps/search/brazil"],
		["!g brazil", "https://encrypted.google.com/search?q=brazil"],
		["!r4 my radio", "https://radio4000.com/search?search=my%20radio"],
		["&gh internet4000/radio4000", "https://github.com/internet4000/radio4000"],
		["&gh internet4000 radio4000", "https://github.com/internet4000/radio4000"],
		[
			"+r4 https://www.youtube.com/watch?v=sZZlQqG7hEg",
			"https://radio4000.com/add?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DsZZlQqG7hEg",
		],
	].forEach(([query, result]) => {
		const success = t.is(Find.decodeUserRequest(query).result, result);
	});
});

test("Find.addEngine adds a new engine", (t) => {
	Find.addEngine(Find.symbols, "!", "ex", "https://example.org");
	const res = Find.symbols["!"].engines["ex"];
	t.is(res, "https://example.org");
});

test("Find.delEngine removes an engine", (t) => {
	Find.addEngine(Find.symbols, "!", "ex", "https://example.org");
	Find.delEngine(Find.symbols, "!", "ex");
	const res = Find.symbols["!"].engines["ex"];
	t.falsy(res);
});

test("Find.decodeUserRequest gives correct results", (t) => {
	const decoded = Find.decodeUserRequest("&gh internet4000 find");
	t.deepEqual(decoded.tokens, ["&gh"]);
	t.is(decoded.symbolGroup, "&gh");
	t.is(decoded.symbol, "&");
	t.is(decoded.engineId, "gh");
	t.is(decoded.result, "https://github.com/internet4000/find");
});

test("Find.replaceUrlPlaceholders gives correct results", (t) => {
	const decoded = Find.decodeUserRequest("&gh internet4000 radio4000");
	t.is(decoded.result, "https://github.com/internet4000/radio4000");
});

test("Find has a init method", (t) => {
	t.is(Find.init(), undefined);
});

test("Find.getEngineUrl returns correct results", (t) => {
	t.is(
		Find.getEngineUrl(Find.symbols, "!", "g"),
		"https://encrypted.google.com/search?q={}"
	);
	t.is(Find.getEngineUrl(Find.symbols, "!", "doesntexist"), undefined);
});

test("Find.buildEngineResultUrl has a default url result", (t) => {
	const url = Find.buildEngineResultUrl("hello");
	t.is(url, "https://duckduckgo.com/?q=hello");
});

test("find handles initial URLSearchParams", (t) => {
	window.location = new URL("https://example.org/?q=test");
	const res = Find.init();
	t.is(res, "https://duckduckgo.com/?q=test");
});

test("find handles initial query in `#` hash URL", (t) => {
	window.location = new URL("https://example.org/#q=test");
	const res = Find.init();
	t.is(res, "https://duckduckgo.com/?q=test");
});
