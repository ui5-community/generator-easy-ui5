import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import getNPMConfig, { _resetCacheForTests } from "../generators/app/getNPMConfig.js";

describe("getNPMConfig", function () {
	let tmp;
	let fakeHome;
	let origEnv;
	let origCwd;
	let origStderrWrite;
	let stderrCapture;

	beforeEach(function () {
		tmp = mkdtempSync(path.join(tmpdir(), "eu5-cfg-"));
		fakeHome = path.join(tmp, "home");
		mkdirSync(fakeHome, { recursive: true });

		// Snapshot the env by value (Object.assign, not reassignment — the
		// real process.env is a libuv-backed proxy and reassigning it
		// detaches the proxy from native getters like os.homedir()).
		origEnv = { ...process.env };
		origCwd = process.cwd();

		// Scrub anything that would leak from the developer's real environment.
		for (const k of Object.keys(process.env)) {
			if (k.toLowerCase().startsWith("npm_config_")) delete process.env[k];
			if (k.startsWith("EASY_UI5_")) delete process.env[k];
		}
		delete process.env.NPM_CONFIG_USERCONFIG;
		delete process.env.NPM_CONFIG_GLOBALCONFIG;

		// Redirect homedir() to a temp dir so the real ~/.easyui5rc / ~/.npmrc
		// can't leak into the test. os.homedir() reads $HOME on POSIX each call.
		process.env.HOME = fakeHome;
		process.env.USERPROFILE = fakeHome; // Windows

		// Point the user npmrc at an empty file inside the temp dir by default
		const emptyUser = path.join(tmp, "empty.npmrc");
		writeFileSync(emptyUser, "");
		process.env.NPM_CONFIG_USERCONFIG = emptyUser;

		// Chdir into a directory that is NOT a parent of fakeHome so the
		// cascade walk doesn't pick up the per-user file unintentionally.
		const cwd = path.join(tmp, "cwd");
		mkdirSync(cwd, { recursive: true });
		process.chdir(cwd);

		// Capture stderr to assert on the deprecation warning.
		stderrCapture = "";
		origStderrWrite = process.stderr.write.bind(process.stderr);
		process.stderr.write = (chunk, ...rest) => {
			stderrCapture += typeof chunk === "string" ? chunk : chunk.toString();
			return origStderrWrite(chunk, ...rest);
		};

		_resetCacheForTests();
	});

	afterEach(function () {
		process.chdir(origCwd);
		// Restore env in place — do NOT reassign process.env (see beforeEach).
		for (const k of Object.keys(process.env)) {
			if (!(k in origEnv)) delete process.env[k];
		}
		for (const [k, v] of Object.entries(origEnv)) {
			if (process.env[k] !== v) process.env[k] = v;
		}
		process.stderr.write = origStderrWrite;
		_resetCacheForTests();
		rmSync(tmp, { recursive: true, force: true });
	});

	// ---------- .easyui5rc (canonical) ----------

	it("reads easy-ui5_* values from ~/.easyui5rc (INI)", function () {
		writeFileSync(path.join(fakeHome, ".easyui5rc"), "ghAuthToken=abc\n");
		assert.equal(getNPMConfig("ghAuthToken"), "abc");
	});

	it("reads easy-ui5_* values from ~/.easyui5rc.json", function () {
		writeFileSync(path.join(fakeHome, ".easyui5rc.json"), JSON.stringify({ ghAuthToken: "abc" }));
		assert.equal(getNPMConfig("ghAuthToken"), "abc");
	});

	it("prefers .easyui5rc.json over .easyui5rc at the same dir", function () {
		writeFileSync(path.join(fakeHome, ".easyui5rc"), "ghAuthToken=ini\n");
		writeFileSync(path.join(fakeHome, ".easyui5rc.json"), JSON.stringify({ ghAuthToken: "json" }));
		assert.equal(getNPMConfig("ghAuthToken"), "json");
	});

	it("walks up from cwd, closer dir wins (ESLint-style cascade)", function () {
		writeFileSync(path.join(fakeHome, ".easyui5rc.json"), JSON.stringify({ ghAuthToken: "home" }));
		const proj = path.join(tmp, "cwd", "nested", "deeper");
		mkdirSync(proj, { recursive: true });
		writeFileSync(path.join(tmp, "cwd", "nested", ".easyui5rc.json"), JSON.stringify({ ghAuthToken: "project" }));
		process.chdir(proj);
		assert.equal(getNPMConfig("ghAuthToken"), "project");
	});

	it("stops the cascade at a file with root:true", function () {
		writeFileSync(path.join(fakeHome, ".easyui5rc.json"), JSON.stringify({ ghAuthToken: "home" }));
		const proj = path.join(tmp, "cwd", "nested");
		mkdirSync(proj, { recursive: true });
		writeFileSync(path.join(proj, ".easyui5rc.json"), JSON.stringify({ root: true, ghBaseUrl: "https://x" }));
		process.chdir(proj);
		// project file declares root:true → no value for ghAuthToken
		assert.equal(getNPMConfig("ghAuthToken"), undefined);
		// non-conflicting key from the root file is still readable
		assert.equal(getNPMConfig("ghBaseUrl"), "https://x");
	});

	it("returns undefined when no config files exist", function () {
		assert.equal(getNPMConfig("ghAuthToken"), undefined);
	});

	// ---------- EASY_UI5_* env vars ----------

	it("EASY_UI5_* env var beats the file cascade", function () {
		writeFileSync(path.join(fakeHome, ".easyui5rc.json"), JSON.stringify({ ghAuthToken: "fromfile" }));
		process.env.EASY_UI5_GH_AUTH_TOKEN = "fromenv";
		assert.equal(getNPMConfig("ghAuthToken"), "fromenv");
	});

	it("EASY_UI5_* env var maps multi-word camelCase correctly", function () {
		process.env.EASY_UI5_ADD_SUB_GENERATOR_PREFIX = "alt-";
		assert.equal(getNPMConfig("addSubGeneratorPrefix"), "alt-");
	});

	// ---------- proxy keys from .npmrc (unchanged) ----------

	it("reads proxy keys (http-proxy) from .npmrc with empty prefix", function () {
		const f = path.join(tmp, ".npmrc");
		writeFileSync(f, "http-proxy=http://corp:8080/\n");
		process.env.NPM_CONFIG_USERCONFIG = f;
		assert.equal(getNPMConfig("http-proxy", ""), "http://corp:8080/");
	});

	it("npm_config_* env vars override .npmrc for proxy keys", function () {
		const f = path.join(tmp, ".npmrc");
		writeFileSync(f, "http-proxy=http://from-file/\n");
		process.env.NPM_CONFIG_USERCONFIG = f;
		process.env["npm_config_http-proxy"] = "http://from-env/";
		assert.equal(getNPMConfig("http-proxy", ""), "http://from-env/");
	});

	// ---------- legacy ~/.npmrc easy-ui5_* (one-release grace) ----------

	it("still resolves legacy easy-ui5_* from ~/.npmrc but warns", function () {
		const f = path.join(fakeHome, ".npmrc");
		writeFileSync(f, "easy-ui5_ghAuthToken=legacy\n");
		process.env.NPM_CONFIG_USERCONFIG = f;
		assert.equal(getNPMConfig("ghAuthToken"), "legacy");
		assert.match(stderrCapture, /legacy easy-ui5_\* keys in ~\/\.npmrc/);
	});

	it("tolerates the //easy-ui5_* malformed legacy form (with warning)", function () {
		const f = path.join(fakeHome, ".npmrc");
		writeFileSync(f, "//easy-ui5_ghAuthToken=legacy\n");
		process.env.NPM_CONFIG_USERCONFIG = f;
		assert.equal(getNPMConfig("ghAuthToken"), "legacy");
	});

	it(".easyui5rc value overrides legacy ~/.npmrc value", function () {
		const npmrcPath = path.join(fakeHome, ".npmrc");
		writeFileSync(npmrcPath, "easy-ui5_ghAuthToken=legacy\n");
		process.env.NPM_CONFIG_USERCONFIG = npmrcPath;
		writeFileSync(path.join(fakeHome, ".easyui5rc.json"), JSON.stringify({ ghAuthToken: "new" }));
		assert.equal(getNPMConfig("ghAuthToken"), "new");
	});

	// ---------- ${ENV_VAR} interpolation ----------

	it("interpolates ${ENV_VAR} inside values", function () {
		writeFileSync(path.join(fakeHome, ".easyui5rc"), "ghAuthToken=${EU5_TEST_TOKEN}\n");
		process.env.EU5_TEST_TOKEN = "expanded";
		assert.equal(getNPMConfig("ghAuthToken"), "expanded");
	});

	// ---------- singleton ----------

	it("caches the merged config across calls (singleton)", function () {
		const f = path.join(fakeHome, ".easyui5rc");
		writeFileSync(f, "ghAuthToken=cached\n");
		assert.equal(getNPMConfig("ghAuthToken"), "cached");
		rmSync(f);
		assert.equal(getNPMConfig("ghAuthToken"), "cached");
	});
});
