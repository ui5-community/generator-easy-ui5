// Regression guard for the yeoman-generator v8 spawn API change.
//
// In yeoman-generator v7, `this.spawnCommand("cmd", ["a", "b"], opts)` and
// `this.spawnCommandSync(...)` accepted an args array as the second arg.
// In v8 those methods take a shell string and ignore an args array, while
// `this.spawn(...)` / `this.spawnSync(...)` accept the args array.
//
// Passing an array to `spawnCommand` silently runs `cmd` with NO arguments
// — that produced the "Command failed with exit code 1: npm" crash that
// shipped when this project bumped to yeoman-generator 8. To stop the
// regression from sneaking back in, fail the build if the legacy API names
// reappear anywhere under `generators/`.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { globSync } from "glob";
import path from "node:path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

describe("yeoman-generator v8 spawn API", function () {
	it("never uses spawnCommand/spawnCommandSync with an array of args", function () {
		const files = globSync("**/*.js", {
			cwd: path.join(__dirname, "..", "generators"),
			absolute: true,
			ignore: ["**/templates/**"],
		});
		const offenders = [];
		for (const file of files) {
			const src = readFileSync(file, "utf8");
			// Strip line and block comments so the explanatory note in the
			// source code itself doesn't trip the check.
			const stripped = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/[^\n]*/g, "$1");
			const re = /\bspawnCommand(?:Sync)?\s*\(\s*[^)]*\[/;
			if (re.test(stripped)) offenders.push(path.relative(path.join(__dirname, ".."), file));
		}
		assert.deepEqual(offenders, [], "use this.spawn(...) / this.spawnSync(...) for arg-array calls — spawnCommand/spawnCommandSync ignore the args in yeoman-generator v8");
	});
});
