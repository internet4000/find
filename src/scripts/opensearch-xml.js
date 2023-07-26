import { OpenSearchDescription } from "../open-search.js";
import packageJson from "../../package.json" assert { type: "json" };
import fs from "fs/promises";
import path from "path";

const OSD_PATH = "assets/opensearch.xml";
const pkgName = packageJson["name"];
const config = packageJson[pkgName];

const readUserPackageJson = async () => {
	const packageJsonPath = path.join(process.cwd(), "package.json");
	const data = await fs.readFile(packageJsonPath, "utf-8");
	let userData;
	try {
		userData = JSON.parse(data) || {};
	} catch (e) {
		console.info("Could not get user config", e);
	}
	return userData;
};

const newUserConfig = async (baseUrl) => {
	const userPackageJson = await readUserPackageJson();
	const userPkgConfig = userPackageJson[pkgName];
	const userConfig = { ...userPkgConfig };
	if (baseUrl) {
		try {
			new URL(baseUrl)
			const { queryParamName } = userConfig;
			userConfig.templateHTML = `${baseUrl}/#${queryParamName}={searchTerms}`;
			userConfig.templateXML = `${baseUrl}/${OSD_PATH}`;
			userConfig.templateSuggestions = `${baseUrl}/api/suggestions/#${queryParamName}={searchTerms}`;
			userConfig.image = `${baseUrl}/assets/favicon.ico`;
		} catch(e) {
			console.error("Wrong config site URL", e)
		}
	}
	return userConfig;
};

const openSearchXml = async () => {
	const { I4K_FIND_URL } = process.env;
	if (!I4K_FIND_URL) {
		throw "missing I4K_FIND_URL=https://example.org/my-find"
	}
	let newConfig;
	try {
		newConfig = await newUserConfig(I4K_FIND_URL);
	} catch (e) {
		console.error(e);
		newConfig = config;
	}
	const {
		shortName,
		description,
		image,
		templateHTML,
		templateXML,
		templateSuggestions,
	} = config
	const osd = new OpenSearchDescription({
		shortName,
		description,
		image,
		templateHTML,
		templateXML,
		templateSuggestions,
	});
	const xmlOutput = osd.exportXML();
	return xmlOutput
};

const init = async () => {
	const argumementsUrlHash = process.argv[2]
	let userArgs
	try {
		userArgs = new URLSearchParams(argumementsUrlHash)
	} catch(e) {
		/* console.log("No user scrip 'URL arguments'", process.argv) */
	}

	const {
		generate = false
	} = userArgs

	const osdXml = await openSearchXml()
	if (generate) {
		if (outputPath) {
			try {
				const localPath = path.join(process.cwd(), OSD_PATH);
				await path.resolve(localPath);
				await fs.writeFile(localPath, osdXml);
			} catch (e) {
				throw(e);
			}
		}
	}
	return osdXml
}
init()

export default openSearchXml;
