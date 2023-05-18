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
		this.setupColor();

		/* handle search (if it is a command) */
		this.querySelector("i4k-find").addEventListener("findSearch", (event) => {
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
		});

		/* if we "sync", also refresh the info */
		this.querySelector("i4k-find-sync").addEventListener("submit", () => {
			this.querySelector("i4k-find-info").refresh();
		});
	}
	setupColor() {
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
								title="Visit documentation"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="&mx #i4k-find:matrix.org"
								title="Visit chat"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="!gh internet4000"
								title="Visit github actor"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="&gh internet4000 find"
								title="Visit github project"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="+wr"
								title="Find random wikipedia article (for lorem ipsum)"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="#add ! ex https://example.org/?search={}"
								title="Add example search engine"
								></i4k-find-query>
						</li>
						<li>
							<i4k-find-query
								q="#del ! ex"
								title="Del example search engine"
								></i4k-find-query>
						</li>
					</menu>
				</details>
			</section>
			<section class="App-header">
				<i4k-find-logo></i4k-find-logo>
				<i4k-find></i4k-find>
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

const i4kFind = class extends HTMLElement {
	connectedCallback() {
		this.render();
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
		this.clearSearch();
	};
	clearSearch() {
		this.querySelector("form input").value = "";
	}
	handleSubmit = (event) => {
		this.findSearch(this.search);
		// prevents form autotransition to `?search=<query>` not triggering `Find` `#q=`
		return false;
	};
	handleInputChange = (input) => {
		this[input.target.name] = input.target.value;
	};
	buildRandomPlaceholder() {}
	render() {
		const $form = document.createElement("form");
		$form.title = "Try to write any search words, or the Find query, !m berlin";
		$form.onsubmit = this.handleSubmit;
		$form.classList.add("Form");

		const $input = document.createElement("input");
		$input.type = "search";
		$input.name = "search";
		$input.placeholder =
			this.buildRandomPlaceholder() || "!docs usage-examples";
		$input.oninput = this.handleInputChange;
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
		const $text = document.createElement("p");
		$text.innerText = `To synchronise the app data between devices,
save, sync, and import it to your usual password manager
create a new entry for this site, and save the data as  'password' field (see !docs #sync).
When saved, prefill the hidden user/password input with your usual password manager.
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

		const $copyButton = document.createElement("button");
		$copyButton.type = "button";
		$copyButton.innerText = "export to clipboard";
		$copyButton.addEventListener("click", this.onCopy.bind(this));

		$form.append($inputPassword);
		$form.append($syncButton);
		$form.append($copyButton);
		this.append($form);
	}

	onCopy({ target }) {
		const data = this.getDataToSync();
		/* output data to be saved to the password manager "password" entry for this site */
		console.table([
			"Data to save to the user pasword mananger credentials for this site (as `password`):",
			data,
		]);
		navigator.clipboard.writeText(data);
		document.querySelector('input[type="password"]').value = data;
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
	connectedCallback() {
		this.query = this.getAttribute("q");
		this.render();
	}

	render() {
		this.innerHTML = "";
		this.renderButton();
	}

	renderButton() {
		const $btn = document.createElement("button");
		$btn.addEventListener("click", this.onClick.bind(this));
		$btn.innerText = this.query;
		this.append($btn);
	}
	onClick(event) {
		if (this.query) {
			Find.find(this.query);
		}
	}
};

customElements.define("i4k-find", i4kFind);
customElements.define("i4k-find-query", i4kFindQuery);
customElements.define("i4k-find-sync", i4kFindSync);
customElements.define("i4k-find-info", i4kFindInfo);
customElements.define("i4k-find-logo", i4kFindLogo);
customElements.define("i4k-find-analytics", i4kFindAnalytics);
customElements.define("i4k-find-app", i4kFindApp);
