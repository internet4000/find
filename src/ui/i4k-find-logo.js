export default class I4kFindLogo extends HTMLElement {
	r4Logo = `
<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" version="1.1" viewBox="0 0 338.66666 338.66669">
	<g transform="translate(349.25 -.66666)">
		<rect style="stroke-width:.26458;fill:#80e5ff" height="254" width="254" y="43" x="-306.92"/>
		<g aria-label="F " transform="matrix(6.397 0 0 6.5266 7127.1 -1495.4)">
			<path d="m-1155.4 248.75h17.168v3.3203h-13.203v8.5938h11.973v3.3203h-11.973v13.926h-3.9648z"/>
		</g>
		<flowRoot xml:space="preserve" style="letter-spacing:0px;font-size:40px;word-spacing:0px;font-family:sans-serif;line-height:1.25;fill:#000000" transform="scale(.26458)">
			<flowRegion>
				<rect y="-117.48" width="1040" x="-2040" height="760"/>
			</flowRegion>
			<flowPara/>
		</flowRoot>
		<rect style="stroke-width:.26458;fill:none" height="338.67" width="338.67" y=".66666" x="-349.25"/>
		<g aria-label="! " transform="matrix(6.397 0 0 6.5266 7235.5 -1495.4)">
			<path d="m-1149.9 248.75h3.9649v12.793l-0.4102 6.9726h-3.1445l-0.4102-6.9726zm0 24.199h3.9649v4.9609h-3.9649z"/>
		</g>
	</g>
</svg>
	`;
	connectedCallback() {
		this.render();
	}
	render() {
		const $homeLink = document.createElement("a");
		$homeLink.classList.add("Title");
		$homeLink.title = "Find! (click and refresh the page for docs)";
		$homeLink.innerHTML = this.r4Logo;
		$homeLink.href = window.location + "?q=!docs usage"
		this.append($homeLink);
	}
}
