export default class I4kFindApp extends HTMLElement {
	/* the cloudflare analytics beacon */
	get CFBeacon() {
		return this.getAttribute("cf-beacon");
	}
	connectedCallback() {
		console.info("Find.help()");
		this.render();
		this._setupColor();

		/* handle search (if it is a command) */
		this.querySelector("i4k-find-search").addEventListener(
			"findSearch",
			this._onFindSearch.bind(this)
		);

		/* if we "sync", also refresh the info */
		this.querySelector("i4k-find-sync").addEventListener(
			"submit",
			this._onFindSync.bind(this)
		);

		Array.from(this.querySelectorAll("i4k-find-query")).forEach(($button) => {
			$button.addEventListener("findQuery", this._onFindQuery.bind(this));
		});
	}
	_onFindSearch(event) {
		/* if no output to a search,
			 it can only be because we have a "valid find command" (# fns)
			 so we stay on the current page */
		console.log("search");
		if (event.detail.output) {
			this.setAttribute("searched", true);
		} else {
			this.removeAttribute("searched");
		}

		/* if we stay on the page after command, let's refresh the info */
		this.querySelector("i4k-find-info").refresh();
	}
	_onFindSync() {
		this.querySelector("i4k-find-info").refresh();
	}
	_onFindQuery(event) {
		event.preventDefault();
		const { detail } = event;
		if (detail) {
			const newSearch = document.createElement("i4k-find-search");
			newSearch.setAttribute("search", detail);
			this.querySelector("i4k-find-search").replaceWith(newSearch);
		}
	}
	_setupColor() {
		/* just for some color */
		this.randomColor = `#${(0x1000000 + Math.random() * 0xffffff)
			.toString(16)
			.substr(1, 6)}`;
		document.documentElement.style.setProperty(
			"--c-bg--random",
			this.randomColor
		);
	}
	render() {
		this.innerHTML = `
			<section class="App-queries">
				<details>
					<summary>Example queries</summary>
					<menu>
						<li>
							<i4k-find-query
								q="!?"
								no-open="true"
								title="Visit documentation"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="&mx #i4k-find:matrix.org"
								no-open="true"
								title="Visit chat"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="!gh internet4000"
								no-open="true"
								title="Visit github actor"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="&gh internet4000 find"
								no-open="true"
								title="Visit github project"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="+wr"
								no-open="true"
								title="Find random wikipedia article (for lorem ipsum)"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="#add ! ex https://example.org/?search={}"
								no-open="true"
								title="Add example search engine"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="#del ! ex"
								no-open="true"
								title="Del example search engine"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="!ex example search"
								no-open="true"
								title="Example search on the example search engine; there is a difference is results if you added or not the search engine the custom user engines"
								></i4k-find-query>
						</li>
					</menu>
				</details>
			</section>
			<section class="App-header">
				<i4k-find-logo></i4k-find-logo>
				<i4k-find-search></i4k-find-search>
			</section>

			<section class="App-body">
				<i4k-find-info></i4k-find-info>
				<details>
					<summary>sync</summary>
					<i4k-find-sync></i4k-find-sync>
				</details>
			</section>`;

		if (this.CFBeacon) {
			const $analytics = document.createElement("i4k-find-analytics");
			$analytics.setAttribute("cf-beacon", this.CFBeacon);
			this.querySelector(".App-body").append($analytics);
		}
	}
}
