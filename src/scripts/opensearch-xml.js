import { I4kFind } from "../index.js";
import packageJson from "../../package.json" assert { type: "json" };

import fs from "fs/promises";
import path from "path";

const pkgName = packageJson["name"];
const config = packageJson[pkgName];

const readUserPackageJson = async () => {
	const packageJsonPath = path.join(process.cwd(), "package.json");
	const data = await fs.readFile(packageJsonPath, "utf-8");
	return JSON.parse(data);
};

const newUserConfig = async () => {
	const userPackageJson = await readUserPackageJson();
	return userPackageJson[pkgName];
};

const openSearchXml = async (outputPath = "opensearch.xml") => {
	let newConfig;
	try {
		newConfig = await newUserConfig();
	} catch (e) {
		console.error(e);
		newConfig = config;
	}
	const find = new I4kFind(newConfig);
	const xmlOutput = find.osd.exportXML();
	if (outputPath) {
		try {
			path.resolve(process.cwd(), outputPath);
			const localPath = path.join(process.cwd(), outputPath);
			await fs.writeFile(localPath, xmlOutput);
		} catch (e) {
			console.error("Unable to write opensearch.xml", e);
		}
	}
};

openSearchXml(process.argv[2]).catch((e) => console.error(e));

export default openSearchXml;
