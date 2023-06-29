import Find from "../index.js";

export default class I4kFindSync extends HTMLElement {
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
}
