import { h } from 'preact'
import Engine from './Engine'

var EnginesList = ({engines, onDelete, canDelete}) => (
	<div className="EngineList">
		{
			Object.keys(engines)
				.map(id => <Engine
											 id={id}
											 url={engines[id]}
											 handleClick={onDelete}
											 handlesClick={canDelete}/> )
		}
	</div>
)

export default EnginesList
