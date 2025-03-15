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
			new URL(baseUrl);
			const { queryParamName } = userConfig;
			userConfig.templateHTML = `${baseUrl}/#${queryParamName}={searchTerms}`;
			userConfig.templateXML = `${baseUrl}/${OSD_PATH}`;
			userConfig.templateSuggestions = `${baseUrl}/api/suggestions/#${queryParamName}={searchTerms}`;
			userConfig.image = `${baseUrl}/assets/favicon.ico`;
		} catch (e) {
			throw e;
		}
	}
	return userConfig;
};

const openSearchXml = async () => {
	const argumementsUrlHash = process.argv[2];
	let userArgs;
	try {
		userArgs = Object.fromEntries(new URLSearchParams(argumementsUrlHash));
	} catch (e) {}
	const { generate = false } = userArgs;
	const { I4K_FIND_URL } = process.env;

	if (!I4K_FIND_URL) {
		return;
	}

	let osdXml;
	try {
		const newConfig = await newUserConfig(I4K_FIND_URL);
		const osd = new OpenSearchDescription(newConfig);
		osdXml = osd.exportXML();
	} catch (e) {
		console.error(e);
		return;
	}

	if (osdXml && generate) {
		try {
			const localPath = path.join(process.cwd(), OSD_PATH);
			await fs.writeFile(localPath, osdXml);
		} catch (e) {
			throw e;
		}
	}
	return osdXml;
};
openSearchXml();

export default openSearchXml;
