import { h } from 'preact';

var Engine = ({id, url }) => {
	return (
		<article className="Engine">
			<span>{id}</span>
			<input value={url} readOnly={true}/>
		</article>
	)
}

export default Engine
