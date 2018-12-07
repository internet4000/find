import { h, Component } from 'preact'
import Find from '../../main'
const {
	symbols: defaultSymbols,
	localStorageKey,
	getUserSymbols } = Find

const withStorage = ExtendedComponent => (
	class extends Component {
		componentDidMount() {
			this.setState({
				userSymbols: getUserSymbols() || this.newUserSymbols(defaultSymbols),
				defaultSymbols: defaultSymbols
			})
		}

		saveUserSymbols = newSymbols => {
			if (!newSymbols) return
			localStorage.setItem(localStorageKey, JSON.stringify(newSymbols))
			this.setState({
				userSymbols: newSymbols
			})
		}

		newUserSymbols = (fromSymbols) => {
			let symbols = JSON.parse(JSON.stringify(fromSymbols))
			Object.keys(symbols).forEach(symbol => {
				symbols[symbol].engines = {}
				if(symbol === '#') {
					delete symbols[symbol]
				}
			})
			return symbols
		}

		addEngine = (symbol, engineId, url) => {
			if(!symbol || !engineId || !url) return false
			let newSymbols = this.state.userSymbols
			newSymbols[symbol].engines[engineId] = url
			this.saveUserSymbols(newSymbols)
		}

		deleteEngine = (symbol, engineId) => {
			if(!symbol || !engineId) return false
			let newSymbols = this.state.userSymbols
			delete newSymbols[symbol].engines[engineId]
			this.saveUserSymbols(newSymbols)
		}

		render() {
			return (
				<ExtendedComponent
					addEngine={this.addEngine}
					deleteEngine={this.deleteEngine}
					userSymbols={this.state.userSymbols}
					defaultSymbols={this.state.defaultSymbols}/>
			)
		}
	}
)

export default withStorage;
