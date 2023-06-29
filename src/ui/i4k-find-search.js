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
	};
	_buildRandomPlaceholder() {}

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
		$input.placeholder =
			this._buildRandomPlaceholder() || "!docs usage-examples";
		$input.addEventListener("input", this._handleInputChange.bind(this));
		$input.required = true;

		const $button = document.createElement("button");
		$button.innerText = "Find";
		$button.type = "submit";

		$form.append($input);
		$form.append($button);

		this.append($form);
	}
}
