import Find from "../index.js";

export default class I4kFindQuery extends HTMLElement {
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
}
