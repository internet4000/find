import { h } from 'preact';

var Engine = ({id, url, handleClick, handlesClick = false }) => {
	return (
		<article className="Engine">
			<span>{id}</span>
			<input value={url} readOnly={true}/>

			{ handlesClick &&
			<button onClick={() => handleClick(id)}>Remove</button>}
		</article>
	)
}

export default Engine
