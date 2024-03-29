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
		return output
	};
	_clearSearch() {
		this.querySelector("form input").value = "";
	}
	_handleSubmit = (event) => {
		event.preventDefault();
		const output = this.findSearch(this.search);
		if (output) {
			this._clearSearch();
		}
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
				if (res.status === 200) {
					suggestions = await res.json();
				}
			} catch (e) {
				console.info("Error fetching suggestions", e);
			}
			if (suggestions) {
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
		$input.required = true;
		$input.placeholder = this._buildRandomPlaceholder() || "!docs usage";
		$input.setAttribute('title', 'Input a Find search query (any search)');
		$input.addEventListener("input", this._handleInputChange.bind(this));
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
		const [terms, descriptions, urls] = suggestions;
		const $datalist = this.querySelector("datalist");
		const $suggestions = [];
		terms.map((term, termIndex) => {
			const $suggestion = document.createElement("option");
			$suggestion.value = term;
			$suggestion.innerText = `${term} ${descriptions[termIndex]}`;
			$suggestions.push($suggestion);
		});
		$datalist.innerHTML = "";
		$datalist.append(...$suggestions);
	}
}
