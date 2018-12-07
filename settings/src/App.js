import { h, Component } from 'preact'
import logo from './find-logo.svg'
import Symbols from './Symbols'
import AddEngine from './AddEngine'
import withStorage from './withStorage'

class App extends Component {

	constructor() {
		super()
		this.defaultSymbols  = {}
		this.userSymbols = {}
	}

	refreshSymbols(updatedUserSymbols) {
		this.setState({
			userSymbols: updatedUserSymbols
		})
	}

	onAdd = (symbol, engineId, url) => {
		this.props.addEngine(symbol, engineId, url)
	}
	onDelete = (symbol, engineId) => {
		this.props.deleteEngine(symbol, engineId)
	}

  render() {
		const { defaultSymbols, userSymbols } = this.props
		const { onDelete, onAdd } = this
		if(!defaultSymbols) return <p>Loading</p>
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

export default withStorage(App);
