import { h } from 'preact';
import EnginesList from './EnginesList'

var Symbols = ({symbols, symbol, onDelete}) => {
	const canDelete = typeof onDelete === 'function'

	return (
		<div className="Symbols">
			{
				symbols && symbols[symbol] ? (
					<EnginesList
						engines={symbols[symbol].engines}
						onDelete={(engineId) => onDelete(symbol, engineId)}
						canDelete={canDelete}/>
				) : (
					<p>No custom engines are defined</p>
				)
			}
		</div>
	)
}

export default Symbols
