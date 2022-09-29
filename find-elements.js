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
	`
	connectedCallback() {
		this.render()
	}
	render() {
		const $homeLink = document.createElement('a')
		$homeLink.classList.add('Title')
		$homeLink.title = "Find!"
		$homeLink.innerHTML = this.r4Logo
		this.append($homeLink)
	}
}


const i4kFindApp = class extends HTMLElement {
	/* the cloudflare analytics beacon */
	get CFBeacon() {
		return this.getAttribute('cf-beacon')
	}
	connectedCallback() {
		this.render()
		this.querySelector('i4k-find').addEventListener('findSearch', (event) => {
			this.setAttribute('searched', true)
		})
		console.log('Find.help()')
	}
	render() {
		this.innerHTML = `
			<section class="App-header">
				<i4k-find-logo></i4k-find-logo>
				<i4k-find></i4k-find>
			</section>

			<section class="App-body">
				<i4k-find-info></i4k-find-info>
			</section>`

		if (this.CFBeacon) {
			const $analytics = document.createElement('i4k-find-analytics')
			$analytics.setAttribute('cf-beacon', this.CFBeacon)
			this.querySelector('.App-body').append($analytics)
		}
	}
}

const i4kFindAnalytics = class extends HTMLElement {
	CFBeaconSrc = 'https://static.cloudflareinsights.com/beacon.min.js'

	get dnt() {
		return navigator.doNotTrack
	}
	get CFBeacon() {
		return this.getAttribute('cf-beacon') || undefined
	}

	async connectedCallback() {
		// check if "do not track", then do not use analytics
		if (this.dnt) {
			console.info('Do-not-track is activated in this browser')
			/* return */
		}

		/* check can render script tag (should not, if ublock is activated: our objective) */
		if (this.CFBeacon) {
			this.renderCFAnalytics()
		}
	}
	disconnectedCallback() {
		console.log('Removed tracking element')
	}
	renderCFAnalytics() {
		const $script = document.createElement('script')
		$script.src = this.CFBeaconSrc
		$script.setAttribute('data-cf-beacon', JSON.stringify({
			'token': this.CFBeacon
		}
		))
		$script.addEventListener('load', this.onAnalyticsLoad.bind(this))
		$script.addEventListener('error', this.onAnalyticsLoadError.bind(this))
		this.append($script)
	}
	onAnalyticsLoad(event) {
		console.info('Analytics trackers are NOT blocked (install "ublock origin") (Cloudflare analytics javascript could be loaded)')
		this.renderInstallBlocker()
	}
	onAnalyticsLoadError(error) {
		console.info('Analytics trackers are BLOCKED. Removing tracking beacon', this)
		this.remove()
	}
	renderInstallBlocker() {
		const $message = document.createElement('p')
		$message.innerText = 'This web browsers does not seem to be blocking analytics and advertisement trackers. Consider installing a blocker for your web-browser:' + ' '

		const $link = document.createElement('a')
		$link.innerText = 'uBlock Origin'
		$link.href = 'https://github.com/gorhill/uBlock/'

		$message.append($link)
		this.append($message)
	}
}

const i4kFind = class extends HTMLElement {
	connectedCallback() {
		this.render()
	}
	findSearch = (query) => {
		if (!query) return false
		Find.find(query)
		const event = new CustomEvent('findSearch', {
			bubbles: true,
			detail: query
		})
		this.dispatchEvent(event)
	}
	handleSubmit = (event) => {
		this.findSearch(this.search)

		// prevents form autotransition to `?search=<query>` not triggering `Find` `?q=`
		return false
	}
	handleInputChange = (input) => {
		this[input.target.name] = input.target.value
	}
	render() {
		const $form = document.createElement('form')
		$form.title = 'Try to write the suggested words, !m brazil'
		$form.onsubmit = this.handleSubmit
		$form.classList.add('Form')

		const $input = document.createElement('input')
		$input.type = 'search'
		$input.name = 'search'
		$input.placeholder = '!m brazil'
		$input.oninput = this.handleInputChange
		$input.required = true

		const $button = document.createElement('button')
		$button.innerText = 'Search'
		$button.type = 'submit'

		$form.append($input)
		$form.append($button)

		this.append($form)
	}
}

const i4kFindInfo = class extends HTMLElement {
	repoUrl = Find ? Find.documentationUrl : 'https://github.com/internet4000/find'
	open = false
	connectedCallback() {
		this.render()
	}
	render() {
		const $symbols = document.createElement('i4k-symbols-list')
		const symbolsList = Object.keys(Find.symbols)
		symbolsList.forEach(symbol => {
			const symbolData = Find.symbols[symbol]
			const symbolEngines = symbolData.engines && Object.keys(symbolData.engines)
			const symbolFns = symbolData.fns && Object.keys(symbolData.fns)

			const $symbolInfo = document.createElement('article')
			const $symbolInfoHeader = document.createElement('header')
			$symbolInfoHeader.innerText = symbol

			const $symbolInfoList = document.createElement('ul')

			symbolEngines && symbolEngines.forEach(engine => {
				const $symbolInfoListItem = document.createElement('li')
				$symbolInfoListItem.innerText = `${engine} : ${symbolData.engines[engine]}`
				$symbolInfoList.append($symbolInfoListItem)
			})

			symbolFns && symbolFns.forEach(fn => {
				const $symbolInfoListItem = document.createElement('li')
				$symbolInfoListItem.innerText = `${fn} : ${symbolData.fns[fn]}`
				$symbolInfoList.append($symbolInfoListItem)
			})

			$symbolInfo.append($symbolInfoHeader)
			$symbolInfo.append($symbolInfoList)
			$symbols.append($symbolInfo)
		})

		/* a string with the intro and doc links */
		const $documentation = document.createElement('i4k-find-info-header')
		$documentation.innerText = "Open bang actions ("
		const $documentationLink = document.createElement('a')
		$documentationLink.href = this.repoUrl
		$documentationLink.innerText = 'docs'
		$documentation.append($documentationLink)
		$documentation.append(')')

		const $detail = document.createElement('details')
		const $summary = document.createElement('summary')
		$summary.innerText = 'Symbols & engines'
		$detail.append($summary)
		$detail.append($symbols)

		this.append($documentation)
		this.append($detail)
	}
}

customElements.define('i4k-find', i4kFind)
customElements.define('i4k-find-info', i4kFindInfo)
customElements.define('i4k-find-logo', i4kFindLogo)
customElements.define('i4k-find-analytics', i4kFindAnalytics)
customElements.define('i4k-find-app', i4kFindApp)
