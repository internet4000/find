import Find, { DEFAULT_SYMBOLS } from "../index.js";

export default class I4kFindInfo extends HTMLElement {
	constructor() {
		super()
		this.open = false;
	}
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
	/* Can be used to render a symbols map,
		 for example, the "default" or "user" symbols */
	renderSymbols(symbolsMap, title) {
		/* for each symbol render a symbol list with info */
		const $symbols = document.createElement("i4k-symbols-list");
		Object.keys(DEFAULT_SYMBOLS).forEach((symbolId) => {
			const defaultData = DEFAULT_SYMBOLS[symbolId]
			const symbolData = symbolsMap[symbolId]
			const {
				name: symbolName = defaultData.name,
				uri = defaultData.uri,
				engines,
				fns,
			} = symbolData || {};

			/* the info "of the symbol definition" Symbol/Name */
			const $symbolInfoDefinition = document.createElement("dl");
			$symbolInfoDefinition.title = uri
			const $symbolTerm = document.createElement("dt");
			const $symbolName = document.createElement("dd");
			$symbolTerm.innerText = symbolId;
			// user symbols don't have data byt the symbol id, and engines id/url
			// only default symbol has data
			$symbolName.innerText = symbolName || DEFAULT_SYMBOLS[symbol].name;
			$symbolInfoDefinition.append($symbolTerm, $symbolName)

			/* the list engines id/url for this symbol */
			const $symbolInfoList = document.createElement("ul");
			if (engines && Object.keys(engines).length) {
				Object.entries(engines).forEach(([engineName, engineUrl]) => {
					const $symbolInfoListItem = document.createElement("li");
					const $engineName = document.createElement("em");
					$engineName.innerText = `${symbolId}${engineName}`;
					const $engineValue = document.createElement("a");
					$engineValue.href = engineUrl;
					try {
						// to be "sure" it is a valid (find) URL and does not contain weird things
						new URL(engineUrl)
						$engineValue.innerHTML = this.highlightPlaceholders(engineUrl);
					} catch(e) {
						$engineValue.innerText = engineUrl;
					}

					$symbolInfoListItem.append($engineName);
					$symbolInfoListItem.append($engineValue);
					$symbolInfoList.append($symbolInfoListItem);
				});
			} else if (!fns) {
				const $noSymbolEngineListItem = document.createElement("li");
				const $noSymbolEngine = document.createElement("input");
				$noSymbolEngine.value = `#add ${symbolId} ex https://example.org/?q={}`;
				$noSymbolEngine.readonly = true;
				$noSymbolEngine.onclick = ({ target }) => target.select();
				$noSymbolEngineListItem.append($noSymbolEngine);
				$symbolInfoList.append($noSymbolEngineListItem);
			}

			if (fns) {
				Object.entries(fns).forEach(([fnName, fn]) => {
					const $symbolInfoListItem = document.createElement("li");

					const $engineName = document.createElement("em");
					$engineName.innerText = `${symbolId}${fnName}`;
					const $engineValue = document.createElement("pre");
					$engineValue.innerText = `${fn.toString()}`;

					$symbolInfoListItem.append($engineName);
					$symbolInfoListItem.append($engineValue);

					$symbolInfoList.append($symbolInfoListItem);
				});
			}

			if (!engines && !fns) {
			}

			/* append the "definition" and "list" */
			const $symbolInfo = document.createElement("article");
			$symbolInfo.setAttribute('symbol', symbolId)
			$symbolInfo.append($symbolInfoDefinition, $symbolInfoList);
			$symbols.append($symbolInfo);
		});

		const $detail = document.createElement("details");
		const $summary = document.createElement("summary");
		const symbolsLen = this.getSymbolsLength(symbolsMap);
		$summary.title = "List of Find symbols !&#+ and engines (id and URL) with URI actions placeholder {} patterns"
		$summary.innerText = `${title} [${symbolsLen}]`;

		$detail.append($summary);
		$detail.append($symbols);

		this.append($detail);
	}

	/* to prevent using innerHTML with a regex, such as `engineUrl.replace(/\{\}/g,"<mark>{}</mark>")` */
	highlightPlaceholders(urlWithPlaceholders) {
		// Create a temporary div element
		const tempDiv = document.createElement('div');

		// Split the url at the placeholder(s)
		const urlParts = urlWithPlaceholders.split("{}");

		// Loop over the urlParts, appending each part and a placeholder after it if it's not the last part
		urlParts.forEach((part, index) => {
			tempDiv.appendChild(document.createTextNode(part));

			if (index < urlParts.length - 1) {
				const mark = document.createElement('mark');
				mark.textContent = '{}';
				tempDiv.appendChild(mark);
			}
		});

		// Return the innerHTML of the temporary div element
		return tempDiv.innerHTML;
	}
}
