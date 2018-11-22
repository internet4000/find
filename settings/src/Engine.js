import { h } from 'preact';

var Engine = props => {
	const {url, shortcut } = props.engine
	return (
		<article>
			<span>{shortcut}</span>
			<input value={url} readOnly={true}/>
		</article>
	)
}

export default Engine
