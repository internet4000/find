import { h } from 'preact';

var Engine = ({id, url }) => {
	return (
		<article>
			<span>{id}</span>
			<input value={url} readOnly={true}/>
		</article>
	)
}

export default Engine
