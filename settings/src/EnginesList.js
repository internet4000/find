import { h } from 'preact'
import Engine from './Engine'

var EnginesList = props => (
	<div>
		{ props.engines.map(engine => <Engine engine={engine}/> )}
	</div>
)

export default EnginesList
