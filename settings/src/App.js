import { h, Component } from 'preact'
import logo from './find-logo.svg'
import { getUserSymbols, getDefaultSymbols, deleteEngine, addEngine }  from './storage'
import Symbols from './Symbols'
import AddEngine from './AddEngine'

class App extends Component {

	constructor() {
		super()
		this.defaultSymbols  = {}
		this.userSymbols = {}
	}

	componentDidMount() {
		this.refreshSymbols()
	}

	refreshSymbols() {
		let state = {
			defaultSymbols: getDefaultSymbols(),
			userSymbols: getUserSymbols()
		}
		this.setState(state)
	}

	onAdd = (symbol, engineId, url) => {
		addEngine(symbol, engineId, url)
		this.refreshSymbols()
	}

	onDelete = (symbol, engineId) => {
		deleteEngine(symbol, engineId)
		this.refreshSymbols()
	}

  render() {
		const { defaultSymbols, userSymbols } = this.state
		const { onDelete, onAdd } = this
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to !Find settings</h2>
          <p>Explore and customize the available action engines.</p>
        </div>

        <div className="App-body">
					<h2>Search engines (!)</h2>
					<AddEngine
						symbol="!"
						onAdd={onAdd}/>
					<Symbols
						symbol="!"
						symbols={userSymbols}
						onDelete={onDelete}/>
					<Symbols
						symbol="!"
						symbols={defaultSymbols}/>

			    <h2>Action engines (+)</h2>
					<AddEngine
						symbol="+"
						onAdd={onAdd}/>
					<Symbols
						symbol="+"
						symbols={userSymbols}
						onDelete={onDelete}/>
					<Symbols
						symbol="+"
						symbols={defaultSymbols}/>
        </div>
      </div>
    )
  }
}

export default App;
