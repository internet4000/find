import { h, Component } from 'preact';

class AddEngine extends Component {
	constructor() {
		super()
		this.url = ''
		this.id = ''
	}

	handleChange = (event) => {
		event.preventDefault()
		const {name, value} = event.target
		this.setState({
			[name]: value
		})
	}

	render(props, state) {
		const {symbol, onAdd } = props
		const {id, url} = state

		return (
			<article className="Engine Engine--add">
				<input
					placeholder="id"
					className="Engine-id"
					name="id"
					value={id}
					onChange={this.handleChange}/>
				<input
					placeholder="url"
					className="Engine-url"
					name="url"
					value={url}
					onChange={this.handleChange}/>

				<button onClick={() => onAdd(symbol, id, url)}>
					Add
				</button>
			</article>
		)
	}
}

export default AddEngine
