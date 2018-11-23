import { h, Component } from 'preact';
import logo from './find-logo.svg';
import EnginesList from './EnginesList';
import { getSearchEngines }  from './storage'

class App extends Component {

	constructor() {
		super()
		this.userSearchEngines = []
	}

	componentDidMount() {
		this.setState({
			userSearchEngines: getSearchEngines()
		})
		console.log('userSearchEngines', this.state.userSearchEngines)
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
					{ this.state.userSearchEngines ? (
						<EnginesList engines={this.state.userSearchEngines}/>
					) : (
						<p>There are no custom user engines</p>
					)}
			</div>


      </div>
    )
  }
}

export default App;
