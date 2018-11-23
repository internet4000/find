import { h, Component } from 'preact'
import logo from './find-logo.svg'
import EnginesList from './EnginesList'
import { getSymbols }  from './storage'

class App extends Component {

	constructor() {
		super()
		this.symbols = {}
	}

	componentDidMount() {
		this.setState({
			symbols: getSymbols()
		})
		console.log('symbols', this.state.symbols)
	}

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to !Find settings</h2>
        </div>
				<p>Explore and customize the available action engines.</p>
				<div className="App-list">
					{ this.state.symbols && this.state.symbols['!'] ? (
						<EnginesList engines={this.state.symbols['!'].engines}/>
					) : (
						<p>There are no custom user engines</p>
					)}
			  </div>
      </div>
    )
  }
}

export default App;
