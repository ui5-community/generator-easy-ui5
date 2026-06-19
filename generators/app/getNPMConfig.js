import { execSync } from "child_process";

let npmConfig;

export default function getNPMConfig(configName, prefix = "easy-ui5_") {
	if (!npmConfig) {
		try {
			const output = execSync("npm config list --json", { encoding: "utf-8", timeout: 10000 });
			npmConfig = JSON.parse(output);
		} catch {
			npmConfig = {};
		}
	}
	return npmConfig[`${prefix}${configName}`];
}
