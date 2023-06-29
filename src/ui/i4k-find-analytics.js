export default class I4kFindAnalytics extends HTMLElement {
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
		console.info(
			"Analytics trackers are BLOCKED. Removing tracking beacon",
			this
		);
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
}
