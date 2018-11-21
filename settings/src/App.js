import { h, Component } from 'preact';
import logo from './find-logo.svg';
import EnginesList from './EnginesList';

class App extends Component {

	constructor() {
		super()
		this.localStorageKey = 'r4find'
		this.userEngines = JSON.parse(localStorage.getItem(this.localStorageKey)) || {}
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
					{ this.userEngines ? (
						<EnginesList/>
						) : (
						<p>There are no user custom engines</p>
					)}
				</div>
      </div>
    );
  }
}

export default App;
