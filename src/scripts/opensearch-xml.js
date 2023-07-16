import Find from "../index.js";

const openSearchXml = () => {
	console.log(Find.osd);
	return process.stdout.write(Find.osd.exportXML());
};

openSearchXml();

export default openSearchXml;
