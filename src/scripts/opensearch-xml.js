import { I4kFind } from "../index.js";
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

const newUserConfig = async (url) => {
	const userPackageJson = await readUserPackageJson();
	const userPkgConfig = userPackageJson[pkgName];
	const userConfig = { ...userPkgConfig };
	if (url) {
		const { queryParamName } = userConfig;
		if (!userConfig.osd) {
			userConfig.osd = {};
		}
		if (!userConfig.osd.templateHTML) {
			userConfig.osd.templateHTML = `${url}/#${queryParamName}={searchTerms}`;
		}
		if (!userConfig.osd.templateXML) {
			userConfig.osd.templateXML = `${url}/${OSD_PATH}`;
		}
		if (!userConfig.osd.image) {
			userConfig.osd.image = `${url}/assets/favicon.ico`;
		}
	}
	return userConfig;
};

const openSearchXml = async () => {
	const { I4K_FIND_URL } = process.env;
	let newConfig;
	try {
		newConfig = await newUserConfig(I4K_FIND_URL);
	} catch (e) {
		console.error(e);
		newConfig = config;
	}
	const find = new I4kFind(newConfig);
	const xmlOutput = find.osd.exportXML();

	if (OSD_PATH) {
		try {
			const localPath = path.join(process.cwd(), OSD_PATH);
			await path.resolve(localPath);
			await fs.writeFile(localPath, xmlOutput);
		} catch (e) {
			console.error("Unable to write opensearch.xml", e);
		}
	}
};

openSearchXml().catch((e) => console.error(e));

export default openSearchXml;
