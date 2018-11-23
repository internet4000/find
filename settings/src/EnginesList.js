import { h } from 'preact'
import Engine from './Engine'

var EnginesList = ({engines}) => (
	<div className="EngineList">
		{
			Object.keys(engines)
				.map(id => <Engine
											 id={id}
											 url={engines[id]}/> )
		}
	</div>
)

export default EnginesList
