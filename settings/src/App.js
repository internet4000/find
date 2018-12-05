import { h, Component } from 'preact'
import logo from './find-logo.svg'
import { getSymbols }  from './storage'
import Symbols from './Symbols'

class App extends Component {

	constructor() {
		super()
		this.defaultSymbols  = {}
		this.userSymbols = {}
	}

	componentDidMount() {
		const { defaultSymbols, userSymbols } =  getSymbols()
		this.setState({
			defaultSymbols,
			userSymbols
		})
	}

	onDelete = (engineId, symbol) => {
		let userSymbols = this.state.userSymbols
		delete userSymbols[symbol].engines[engineId]
		this.setState({
			userSymbols
		})
	}

  render() {
		const { defaultSymbols, userSymbols } = this.state
		const onDelete = this.onDelete
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to !Find settings</h2>
          <p>Explore and customize the available action engines.</p>
        </div>

        <div className="App-body">
					<h2>Search engines (!)</h2>
					<Symbols
						symbol="!"
						symbols={userSymbols}
						onDelete={onDelete}/>
					<Symbols
						symbol="!"
						symbols={defaultSymbols}/>

			    <h2>Action engines (+)</h2>
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
