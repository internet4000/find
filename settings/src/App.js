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
	}

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to !Find settings</h2>
          <p>Explore and customize the available action engines.</p>
        </div>

        <div className="App-body">
					<h2>Search engines (!)</h2>
					{ this.state.symbols && this.state.symbols['!'] ? (
						<EnginesList
							engines={this.state.symbols['!'].engines}/>
					) : (
						<p>There are no search engines</p>
					)}

			    <h2>Action engines (+)</h2>
				  { this.state.symbols && this.state.symbols['+'] ? (
					  <EnginesList engines={this.state.symbols['+'].engines}/>
					) : (
						<p>There are no action engines</p>
					)}

			    <h2>User engines (+)</h2>
				  { this.state.symbols && Object.keys(this.state.symbols['user'].engines).length ? (
					  <EnginesList engines={this.state.symbols['user'].engines}/>
					) : (
						<p>There are no user engines</p>
					)}
        </div>
      </div>
    )
  }
}

export default App;
