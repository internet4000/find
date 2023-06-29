import Find from "../index.js";

export default class I4kFindInfo extends HTMLElement {
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
}
