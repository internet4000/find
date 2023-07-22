import Find from "../index.js";

export default class I4kFindSync extends HTMLElement {
	connectedCallback() {
		this.render();
	}

	render() {
		this.innerHTML = "";
		this.renderForm();
	}

	renderForm() {
		const $form = document.createElement("form");
		$form.addEventListener("submit", this.onSubmit.bind(this));

		const $import = document.createElement("textarea");
		$import.setAttribute("name", "import");
		$import.setAttribute("title", "Paste in the user JSON data to be imported, in order to import it in this instance of find");
		$import.setAttribute("required", true);
		$import.setAttribute("placeholder", 'exported JSON data, ex: {"userSymbols": {...}}');

		// not used yet
		const $importAuto = document.createElement("input");
		$importAuto.setAttribute("name", "import-auto");
		$importAuto.setAttribute("type", "password");
		$importAuto.setAttribute("hidden", true);
		$importAuto.setAttribute("autocomplete", "password");
		$importAuto.setAttribute("placeholder", "password='appData{userSymbols}'");

		const $syncButton = document.createElement("button");
		$syncButton.type = "submit";
		$syncButton.innerText = "import user data";

		const $export = document.createElement("textarea");
		$export.value = this.getDataToSync();
		$export.setAttribute("readonly", true);
		$export.setAttribute("title", "User data as a JSON string. Copy to export. Save somewhere (in a text file) to import later, or somewhere else.");
		$export.addEventListener("click", this.onCopy.bind(this));

		const $importLabel = document.createElement("legend");
		const $exportLabel = document.createElement("legend");
		$importLabel.innerText = "Import JSON data"
		$exportLabel.innerText = "Export JSON data"

		const $importFieldset = document.createElement("fieldset");
		const $exportFieldset = document.createElement("fieldset");
		$importFieldset.append($importLabel, $import, $syncButton);
		$exportFieldset.append($exportLabel, $export);
		$form.append($importAuto, $importFieldset, $exportFieldset, this._createHelp());
		this.append($form);
	}

	_createHelp() {
		const $fieldset = document.createElement("fieldset");
		const $legend = document.createElement("legend");
		$legend.innerText = "Syncronization flow"
		const $text = document.createElement("pre");
		$text.innerText = `# Export (save)
1. Copy JSON data of your user settings
2. Save as a new entry for this site, in your usual browser password manager
2. Have the password manager, like for password, synchronise the data between your devices

# Import (for a new device/browser)
1. when saved, prefill the import input, from the password manager, like for a password (it is your "private user search engines" after all)
2. Click the import button, to add all engines

# Recommendations:
- Always import first, before editing your exising search engines
- Always export/(auto,manual)sync to your (browser) password manager, after any edit
		`;
		$fieldset.append($legend, $text);
		return $fieldset
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

	/* TODO: not working yet
		 Save to the browser credentials / password mananger */
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
		const newDataAutoRaw = formData.get("import-auto");
		const newDataRaw = formData.get("import");
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
		Find.importUserSymbols(userSymbols);
		console.info("newData imported", userSymbols, Find.getUserSymbols());
	}

	getDataToSync() {
		return JSON.stringify({
			userSymbols: Find.getUserSymbols(),
		});
	}
}
