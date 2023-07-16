import Find from "../index.js";

export default class I4kFindSearch extends HTMLElement {
	static get observedAttributes() {
		return ["search"];
	}
	get search() {
		return this.getAttribute("search") || "";
	}
	set search(str) {
		this.setAttribute("search", str);
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
		event.preventDefault();
		this.findSearch(this.search);
		// prevents form autotransition to `?search=<query>` not triggering `Find` `#q=`
		return false;
	};
	_handleInputChange = (input) => {
		this[input.target.name] = input.target.value;
		this._handleSuggestions(input);
	};
	_buildRandomPlaceholder() {}

	async _handleSuggestions({ target: { value, name } }) {
		if (value) {
			const suggestionUrl = `api/suggestions#q=${encodeURIComponent(value)}`;
			let suggestions;
			try {
				const res = await fetch(suggestionUrl);
				suggestions = await res.json();
			} catch (e) {
				console.info("Error fetching suggestions", e);
			}
			if (suggestions) {
				console.log("i4k-search suggestions", suggestions);
				this._renderSuggestions(suggestions);
			}
		}
	}

	_render() {
		this.innerHTML = "";
		const $form = document.createElement("form");
		$form.title = "Try to write any search words, or the Find query, !m berlin";
		$form.addEventListener("submit", this._handleSubmit.bind(this));
		$form.classList.add("Form");

		const $input = document.createElement("input");
		$input.type = "search";
		$input.name = "search";
		$input.value = this.search;
		$input.placeholder = this._buildRandomPlaceholder() || "!docs usage";
		$input.addEventListener("input", this._handleInputChange.bind(this));
		$input.required = true;
		$input.setAttribute("list", "suggestions");

		const $inputData = document.createElement("datalist");
		$inputData.id = "suggestions";

		const $button = document.createElement("button");
		$button.innerText = "Find";
		$button.type = "submit";

		$form.append($input, $inputData, $button);

		this.append($form);
	}
	_renderSuggestions([query = "", suggestions = []]) {
		const $datalist = this.querySelector("datalist");
		const $suggestions = suggestions.map((suggestion) => {
			const [engineSymbol, engineId] = suggestion;
			const $suggestion = document.createElement("option");
			$suggestion.value = engineSymbol + engineId;
			return $suggestion;
		});
		$datalist.innerHTML = "";
		$datalist.append(...$suggestions);
	}
}
