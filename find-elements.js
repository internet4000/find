const i4kFind = class extends HTMLElement {
	connectedCallback() {
		this.render()
	}
	findSearch = (query) => {
		if(!query) return false
		Find.find(query)
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
	repoUrl = 'https://github.com/internet4000/find'
	open = false
	connectedCallback() {
		this.render()
	}
	toggleInfo = () => {
		if (!this.open) {
			this.open = true
			this.setAttribute('open', "true")
		} else {
			this.open = false
			this.removeAttribute('open')
		}
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
				console.log(symbolData)
				$symbolInfoListItem.innerText = `${fn} : ${symbolData.fns[fn]}`
				$symbolInfoList.append($symbolInfoListItem)
			})

			$symbolInfo.append($symbolInfoHeader)
			$symbolInfo.append($symbolInfoList)
			$symbols.append($symbolInfo)
		})

		const $buttonToggle = document.createElement('button')
		$buttonToggle.innerText = 'Info'
		$buttonToggle.onclick = this.toggleInfo

		const $documentation = document.createElement('p')
		$documentation.innerText = "Replace your browser's default search engine," + ' '
		const $documentationLink = document.createElement('a')
		$documentationLink.href = 'https://github.com/internet4000/find'
		$documentationLink.innerText = 'learn more'
		$documentation.append($documentationLink)
		$documentation.append('.')

		this.append($buttonToggle)
		this.append($documentation)
		this.append($symbols)
	}
}

customElements.define('i4k-find', i4kFind)
customElements.define('i4k-find-info', i4kFindInfo)
