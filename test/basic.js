import path from "path";
import { mkdirSync, cpSync, rmSync } from "fs";
import assert from "yeoman-assert";
import helpers from "yeoman-test";
import url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const pluginsHome = path.join(__dirname, "_/plugin-generators");

// One row per yeoman-generator major version we want to verify the easy-ui5
// runtime can host. The fixture sources live under test/generator-ui5-test-v<N>/
// and get copied into the plugin cache before each suite runs. Each fixture
// declares its own `dependencies.yeoman-generator` pin so installing the
// plugin cache exercises the matching major.
//
// To add another major: drop a fixture directory next to the others, then
// add a row here pointing at it and naming the file it should produce.
const FIXTURES = [
	{ major: 4, subgen: "test-v4", expectedFile: "testFileA.md" },
	{ major: 5, subgen: "test-v5", expectedFile: "testFileC.md" },
	{ major: 6, subgen: "test-v6", expectedFile: "testFileE.md" },
	{ major: 7, subgen: "test-v7", expectedFile: "testFileG.md" },
	{ major: 8, subgen: "test-v8", expectedFile: "testFileI.md" },
];

for (const { major, subgen, expectedFile } of FIXTURES) {
	const fixtureName = `generator-ui5-${subgen}`;
	const fixtureSource = path.join(__dirname, fixtureName);
	const fixtureDest = path.join(pluginsHome, fixtureName);

	describe(`Basic V${major} project capabilities`, function () {
		this.timeout(120000);

		before(function () {
			mkdirSync(fixtureDest, { recursive: true });
			cpSync(fixtureSource, fixtureDest, { recursive: true });
		});

		it("should be able to run the test generator", async function () {
			return new Promise((resolve, reject) => {
				helpers
					.run(path.join(__dirname, "../generators/app"))
					.inTmpDir()
					.withArguments([subgen])
					.withOptions({
						pluginsHome,
						offline: true,
						verbose: true,
					})
					.on("end", (ctx) => {
						// ensure the async write took place
						setTimeout(() => {
							resolve(ctx);
						}, 1000);
					})
					.on("error", (err) => {
						reject(err);
					});
			});
		});

		it("should create the test file", function () {
			return assert.file([expectedFile]);
		});

		after(function () {
			rmSync(fixtureDest, { recursive: true });
		});
	});
}
