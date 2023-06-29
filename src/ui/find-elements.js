import Find from "../index.js";

const i4kFindLogo = class extends HTMLElement {
	r4Logo = `
<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" version="1.1" viewBox="0 0 338.66666 338.66669">
	<g transform="translate(349.25 -.66666)">
		<rect style="stroke-width:.26458;fill:#80e5ff" height="254" width="254" y="43" x="-306.92"/>
		<g aria-label="F " transform="matrix(6.397 0 0 6.5266 7127.1 -1495.4)">
			<path d="m-1155.4 248.75h17.168v3.3203h-13.203v8.5938h11.973v3.3203h-11.973v13.926h-3.9648z"/>
		</g>
		<flowRoot xml:space="preserve" style="letter-spacing:0px;font-size:40px;word-spacing:0px;font-family:sans-serif;line-height:1.25;fill:#000000" transform="scale(.26458)">
			<flowRegion>
				<rect y="-117.48" width="1040" x="-2040" height="760"/>
			</flowRegion>
			<flowPara/>
		</flowRoot>
		<rect style="stroke-width:.26458;fill:none" height="338.67" width="338.67" y=".66666" x="-349.25"/>
		<g aria-label="! " transform="matrix(6.397 0 0 6.5266 7235.5 -1495.4)">
			<path d="m-1149.9 248.75h3.9649v12.793l-0.4102 6.9726h-3.1445l-0.4102-6.9726zm0 24.199h3.9649v4.9609h-3.9649z"/>
		</g>
	</g>
</svg>
	`;
	connectedCallback() {
		this.render();
	}
	render() {
		const $homeLink = document.createElement("a");
		$homeLink.classList.add("Title");
		$homeLink.title = "Find!";
		$homeLink.innerHTML = this.r4Logo;
		this.append($homeLink);
	}
};

const i4kFindApp = class extends HTMLElement {
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
			this.querySelector("i4k-find-search").setAttribute("search", detail);
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
};

const i4kFindAnalytics = class extends HTMLElement {
	CFBeaconSrc = "https://static.cloudflareinsights.com/beacon.min.js";

	get dnt() {
		return navigator.doNotTrack;
	}
	get CFBeacon() {
		return this.getAttribute("cf-beacon") || undefined;
	}

	async connectedCallback() {
		// check if "do not track", then do not use analytics
		if (this.dnt) {
			console.info("Do-not-track is activated in this browser");
			/* return */
		}

		/* check can render script tag (should not, if ublock is activated: our objective) */
		if (this.CFBeacon) {
			this.renderCFAnalytics();
		}
	}
	disconnectedCallback() {
		console.info("Removed tracking element");
	}
	renderCFAnalytics() {
		const $script = document.createElement("script");
		$script.src = this.CFBeaconSrc;
		$script.setAttribute(
			"data-cf-beacon",
			JSON.stringify({
				token: this.CFBeacon,
			})
		);
		$script.addEventListener("load", this.onAnalyticsLoad.bind(this));
		$script.addEventListener("error", this.onAnalyticsLoadError.bind(this));
		this.append($script);
	}
	onAnalyticsLoad(event) {
		console.info(
			'Analytics trackers are NOT blocked (install "ublock origin") (Cloudflare analytics javascript could be loaded)'
		);
		this.renderInstallBlocker();
	}
	onAnalyticsLoadError(error) {
		console.info(
			"Analytics trackers are BLOCKED. Removing tracking beacon",
			this
		);
		this.remove();
	}
	renderInstallBlocker() {
		const $message = document.createElement("p");
		$message.innerText =
			"This web browsers does not seem to be blocking analytics and advertisement trackers. Consider installing a blocker for your web-browser:" +
			" ";

		const $link = document.createElement("a");
		$link.innerText = "uBlock Origin";
		$link.href = "https://github.com/gorhill/uBlock/";

		$message.append($link);
		this.append($message);
	}
};

const i4kFindSearch = class extends HTMLElement {
	static get observedAttributes() {
		return ["search"];
	}
	get search() {
		return this.getAttribute("search") || "";
	}
	attributeChangedCallback() {
		this._render();
	}
	connectedCallback() {
		this._render();
	}
	findSearch = (query) => {
		if (!query) return false;
		const output = Find.find(query);
		const event = new CustomEvent("findSearch", {
			bubbles: true,
			detail: {
				query,
				output,
			},
		});
		this.dispatchEvent(event);
		this._clearSearch();
	};
	_clearSearch() {
		this.querySelector("form input").value = "";
	}
	_handleSubmit = (event) => {
		this.findSearch(this.search);
		// prevents form autotransition to `?search=<query>` not triggering `Find` `#q=`
		return false;
	};
	_handleInputChange = (input) => {
		this[input.target.name] = input.target.value;
	};
	_buildRandomPlaceholder() {}

	_render() {
		this.innerHTML = "";
		const $form = document.createElement("form");
		$form.title = "Try to write any search words, or the Find query, !m berlin";
		$form.onsubmit = this._handleSubmit;
		$form.classList.add("Form");

		console.log(this.search);
		const $input = document.createElement("input");
		$input.type = "search";
		$input.name = "search";
		$input.value = this.search;
		$input.placeholder =
			this._buildRandomPlaceholder() || "!docs usage-examples";
		$input.oninput = this._handleInputChange;
		$input.required = true;

		const $button = document.createElement("button");
		$button.innerText = "Find";
		$button.type = "submit";

		$form.append($input);
		$form.append($button);

		this.append($form);
	}
};

const i4kFindInfo = class extends HTMLElement {
	repoUrl = Find
		? Find.documentationUrl
		: "https://github.com/internet4000/find";
	open = false;
	connectedCallback() {
		this.render();

		/*
			 local storage event only triggered from other tabs/windows
			 https://stackoverflow.com/questions/5370784/localstorage-eventlistener-is-not-called
			 https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
		 */
		window.addEventListener("storage", this.onStorage.bind(this));
	}
	disconnectedCallback() {
		window.removeEventListener("storage", this.onStorage.bind(this));
	}
	onStorage(event) {
		// instead of updating the find info here, we do it on "find submit"
		console.info(
			"storage event",
			JSON.parse(window.localStorage.getItem(Find.localStorageKey))
		);
	}
	getSymbolsLength(symbols) {
		let length = 0;
		Object.values(symbols).forEach((symbol) => {
			length += symbol.engines ? Object.keys(symbol.engines).length : 0;
		});
		return length;
	}
	/* an alias for the public api */
	refresh() {
		this.render();
	}
	render() {
		this.innerHTML = "";
		const userSymbols = Find.getUserSymbols();
		this.renderSymbols(Find.symbols, "default");
		if (userSymbols) {
			this.renderSymbols(userSymbols, "user");
		}
	}
	renderSymbols(symbols, title) {
		const symbolsLen = this.getSymbolsLength(symbols);

		const $symbols = document.createElement("i4k-symbols-list");
		const symbolsList = Object.keys(symbols);
		Object.entries(symbols).forEach(([symbol, symbolData]) => {
			const { name: symbolName, engines, fns } = symbolData;

			const $symbolInfo = document.createElement("article");
			const $symbolInfoHeader = document.createElement("header");
			$symbolInfoHeader.innerText = symbol;

			const $symbolInfoList = document.createElement("ul");

			if (engines && Object.keys(engines).length) {
				Object.entries(engines).forEach(([engineName, engineUrl]) => {
					const $symbolInfoListItem = document.createElement("li");
					const $engineName = document.createElement("em");
					$engineName.innerText = `${symbol}${engineName}`;
					const $engineValue = document.createElement("a");
					$engineValue.href = engineUrl;
					$engineValue.innerHTML = engineUrl.replace(
						/\{\}/g,
						"<mark>{}</mark>"
					);

					$symbolInfoListItem.append($engineName);
					$symbolInfoListItem.append($engineValue);
					$symbolInfoList.append($symbolInfoListItem);
				});
			} else if (!fns) {
				const $noSymbolEngineListItem = document.createElement("li");
				const $noSymbolEngine = document.createElement("input");
				$noSymbolEngine.value = `#add ${symbol} ex https://example.org/?q={}`;
				$noSymbolEngine.readonly = true;
				$noSymbolEngine.onclick = ({ target }) => target.select();
				$noSymbolEngineListItem.append($noSymbolEngine);
				$symbolInfoList.append($noSymbolEngineListItem);
			}

			if (fns) {
				Object.entries(fns).forEach(([fnName, fn]) => {
					const $symbolInfoListItem = document.createElement("li");

					const $engineName = document.createElement("em");
					$engineName.innerText = `${symbol}${fnName}`;
					const $engineValue = document.createElement("pre");
					$engineValue.innerText = `${fn.toString()}`;

					$symbolInfoListItem.append($engineName);
					$symbolInfoListItem.append($engineValue);

					$symbolInfoList.append($symbolInfoListItem);
				});
			}

			if (!engines && !fns) {
				const $newSymbolEngineInfo = document.createElement("kbd");
				$newSymbolEngineInfo.innerText =
					$symbolInfoList.apennd($newSymbolEngineInfo);
			}

			$symbolInfo.append($symbolInfoHeader);
			$symbolInfo.append($symbolInfoList);
			$symbols.append($symbolInfo);
		});

		const $detail = document.createElement("details");
		const $summary = document.createElement("summary");
		$summary.innerText = `${title} [${symbolsLen}]`;

		$detail.append($summary);
		$detail.append($symbols);

		this.append($detail);
	}
};

const i4kFindSync = class extends HTMLElement {
	connectedCallback() {
		this.render();
	}

	render() {
		this.innerHTML = "";
		this.renderHelp();
		this.renderForm();
	}

	renderHelp() {
		const $text = document.createElement("pre");
		$text.innerText = `To synchronise the app data between devices:
- save, sync, and import it to your usual password manager
- create a new entry for this site, and save the data as  'password' field (see !docs #sync).
- when saved, prefill the hidden user/password input with your usual password manager.
- the input[name="password"] is used for user defined data{engines}`;
		this.append($text);
	}

	renderForm() {
		const $form = document.createElement("form");
		$form.addEventListener("submit", this.onSubmit.bind(this));

		const $inputPassword = document.createElement("input");
		$inputPassword.setAttribute("name", "password");
		$inputPassword.setAttribute("type", "password");
		$inputPassword.setAttribute("required", "true");
		$inputPassword.setAttribute("autocomplete", "password");
		$inputPassword.setAttribute("placeholder", "password=appData{userSymbols}");

		const $syncButton = document.createElement("button");
		$syncButton.type = "submit";
		$syncButton.innerText = "import from credentials";

		const $export = document.createElement("textarea");
		$export.value = this.getDataToSync();
		$export.setAttribute("readonly", true);
		$export.setAttribute("title", "User data. Copy to export.");
		$export.addEventListener("click", this.onCopy.bind(this));

		const $importFieldset = document.createElement("fieldset");
		const $exportFieldset = document.createElement("fieldset");
		$importFieldset.append($inputPassword, $syncButton);
		$exportFieldset.append($export);
		$form.append($importFieldset, $exportFieldset);
		this.append($form);
	}

	onCopy({ target }) {
		const data = this.getDataToSync();
		target.focus();
		target.select();
	}

	onSubmit(event) {
		event.preventDefault();
		/* the data, is the one submitted by the user, to import in the app;
			 from filling the input with the "credentials" (in our case, just app data) */
		const formData = new FormData(event.target);
		this.syncCredentials(formData);
		this.syncLoginForm(formData);
	}
	async syncCredentials() {
		if ("credentials" in navigator) {
			let creds;
			try {
				creds = await navigator.credentials.get({
					password: true, // `true` to obtain password credentials
					federated: {
						providers: [
							// Specify an array of IdP strings
							window.location.hostname,
						],
					},
				});
			} catch (e) {
				/* console.info("Credentials API not supported", e); */
			}
		}
	}

	/* a method, to import/export the app user data */
	syncLoginForm(formData) {
		const newDataRaw = formData.get("password");
		let newDataJson;
		if (newDataRaw) {
			try {
				newDataJson = JSON.parse(newDataRaw);
			} catch (e) {
				console.error("data to import is not a JSON string ", e);
			}
		}
		if (!newDataJson) return;
		const { userSymbols } = newDataJson;
		Find.setUserSymbols(userSymbols);
		console.info("newData imported", userSymbols, Find.getUserSymbols());
	}

	getDataToSync() {
		return JSON.stringify({
			userSymbols: Find.getUserSymbols(),
		});
	}
};

const i4kFindQuery = class extends HTMLElement {
	static get observedAttributes() {
		return ["no-open", "q", "query"];
	}
	get noOpen() {
		return this.getAttribute("no-open") === "true";
	}
	get query() {
		return this.getAttribute("q") || this.getAttribute("query");
	}

	attributeChangedCallback() {
		this._render();
	}
	connectedCallback() {
		this._render();
	}
	_render() {
		this.innerHTML = "";
		const $btn = this._createButton();
		this.append($btn);
	}

	_createButton() {
		const $btn = document.createElement("button");
		$btn.addEventListener("click", this._onClick.bind(this));
		$btn.innerText = this.query;
		return $btn;
	}

	_onClick(event) {
		if (this.query) {
			const decodedRequest = Find.decodeUserRequest(this.query);
			const { result } = decodedRequest;

			const event = new CustomEvent("findQuery", {
				bubbles: true,
				detail: this.query,
				cancelable: true,
			});
			this.dispatchEvent(event);

			if (!this.noOpen) {
				Find.openUrl(result);
			}
		}
	}
};

const componentDefinitions = {
	"i4k-find-search": i4kFindSearch,
	"i4k-find-query": i4kFindQuery,
	"i4k-find-sync": i4kFindSync,
	"i4k-find-info": i4kFindInfo,
	"i4k-find-logo": i4kFindLogo,
	"i4k-find-analytics": i4kFindAnalytics,
	"i4k-find-app": i4kFindApp,
};

export function defineComponents(components = []) {
	if (components.length === 0) {
		components = [...Object.keys(componentDefinitions)];
	}
	for (const [componentName, componentClass] of Object.entries(
		componentDefinitions
	)) {
		if (
			!customElements.get(componentName) &&
			components.includes(componentName)
		) {
			customElements.define(componentName, componentClass);
		}
	}
}

defineComponents();

export default componentDefinitions;
