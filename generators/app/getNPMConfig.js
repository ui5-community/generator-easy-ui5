import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

// Singleton cache of the merged config map.
let npmConfig;

// Internal: keys we accept from .npmrc. Application keys (easy-ui5_*) are
// being phased out of .npmrc — npm 11+ warns and npm 12 will reject them.
// Proxy keys remain legitimate npm config and continue to be read from .npmrc.
const NPMRC_PROXY_KEYS = new Set(["http-proxy", "https-proxy", "proxy", "no-proxy"]);

// Map an easy-ui5 option name (`ghAuthToken`) to its EASY_UI5_* env-var name
// (`EASY_UI5_GH_AUTH_TOKEN`). Inserts an underscore before each upper-case run.
function envVarNameFor(optionName) {
	const snake = optionName.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2");
	return `EASY_UI5_${snake.toUpperCase()}`;
}

// ---------- parsers ----------

// Minimal INI parser for .easyui5rc / .npmrc. Handles blank lines, `;`/`#`
// comments, and flat `key = value` pairs. No sections, no JSON coercion.
function parseIni(raw) {
	const out = {};
	for (const rawLine of raw.split(/\r?\n/)) {
		let line = rawLine.replace(/(^|\s)[;#].*$/, "$1").trim();
		if (!line) continue;
		const eq = line.indexOf("=");
		if (eq < 0) continue;
		const key = line.slice(0, eq).trim();
		let value = line.slice(eq + 1).trim();
		if (!key) continue;
		if ((value.startsWith('"') && value.endsWith('"') && value.length >= 2) || (value.startsWith("'") && value.endsWith("'") && value.length >= 2)) {
			value = value.slice(1, -1);
		}
		out[key] = value;
	}
	return out;
}

function parseJson(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
	} catch {
		/* fall through */
	}
	return {};
}

function readFile(file) {
	if (!file) return null;
	try {
		return readFileSync(file, "utf-8");
	} catch {
		return null;
	}
}

// Read a .npmrc, returning {data, raw}. We need the raw object to detect
// legacy easy-ui5_* keys for the deprecation warning even though we don't
// expose them as resolved config (we strip them to proxy-keys only).
function readNpmrc(file) {
	const raw = readFile(file);
	if (raw == null) return { all: {}, proxy: {} };
	const all = parseIni(raw);
	// also normalise `//easy-ui5_*` to the bare key, for legacy-detection only
	for (const [k, v] of Object.entries(all)) {
		if (k.startsWith("//easy-ui5_")) {
			const stripped = k.slice(2);
			if (!(stripped in all)) all[stripped] = v;
		}
	}
	const proxy = {};
	for (const key of NPMRC_PROXY_KEYS) {
		if (key in all) proxy[key] = all[key];
	}
	return { all, proxy };
}

// Read an .easyui5rc[.json] file. JSON takes precedence over INI at the same
// directory level. Returns { data, root } where `root` indicates the file
// declared itself as the cascade root.
function readEasyUi5Rc(dir) {
	const jsonPath = path.join(dir, ".easyui5rc.json");
	const iniPath = path.join(dir, ".easyui5rc");

	let data = {};
	const jsonRaw = readFile(jsonPath);
	if (jsonRaw != null) data = parseJson(jsonRaw);
	else {
		const iniRaw = readFile(iniPath);
		if (iniRaw != null) data = parseIni(iniRaw);
	}

	const root = data && (data.root === true || data.root === "true");
	if (root) delete data.root;
	return { data, root };
}

// ---------- value transforms ----------

// npm-style ${ENV_VAR} interpolation in values, with a recursion guard.
function expandEnv(value, depth = 0) {
	if (typeof value !== "string" || depth > 10) return value;
	let replaced = false;
	const out = value.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (m, name) => {
		const v = process.env[name];
		if (v === undefined) return m;
		replaced = true;
		return v;
	});
	return replaced ? expandEnv(out, depth + 1) : out;
}

// ---------- env sources ----------

// Pull `npm_config_*` env vars; only proxy keys are honoured, because
// `easy-ui5_*` is no longer an npm-namespace concern.
function readEnvNpmConfig() {
	const out = {};
	for (const [k, v] of Object.entries(process.env)) {
		if (!k.toLowerCase().startsWith("npm_config_")) continue;
		const raw = k.slice("npm_config_".length);
		const lower = raw.toLowerCase();
		const dashed = lower.replace(/_/g, "-");
		if (NPMRC_PROXY_KEYS.has(lower)) out[lower] = v;
		if (NPMRC_PROXY_KEYS.has(dashed)) out[dashed] = v;
	}
	return out;
}

// Resolve `EASY_UI5_*` env vars to easy-ui5_<camelCase> keys. We only know
// the canonical option names when getNPMConfig() is called, so we don't
// pre-compute this map — instead `getNPMConfig` checks process.env directly
// after the file cascade misses.
//
// This function is unused for file-cascade building; kept here as a stub
// for symmetry / documentation. The real resolution happens in getNPMConfig.

// ---------- the cascade ----------

// Walk from `startDir` upward, collecting .easyui5rc[.json] at each level.
// Stops at a directory whose file sets `root: true`, or at homedir, or at
// filesystem root, whichever comes first. Always also reads ~/.easyui5rc at
// the end (lowest precedence) so a per-user file always applies.
//
// Result is ordered low-precedence-first.
function collectEasyUi5RcCascade(startDir) {
	const home = homedir();
	const visited = new Set();
	const chain = []; // each entry: { dir, data }

	let dir = path.resolve(startDir);
	let stoppedAtRoot = false;
	for (let i = 0; i < 64; i++) {
		if (visited.has(dir)) break;
		visited.add(dir);

		const { data, root } = readEasyUi5Rc(dir);
		if (Object.keys(data).length > 0 || root) {
			chain.push({ dir, data });
		}
		if (root) {
			stoppedAtRoot = true;
			break;
		}
		if (dir === home) break;
		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}

	// Always include the home file (if not already visited and not stopped by `root:true`)
	if (!stoppedAtRoot && !visited.has(home)) {
		const { data } = readEasyUi5Rc(home);
		if (Object.keys(data).length > 0) chain.push({ dir: home, data });
	}

	// chain is ordered cwd → root (high precedence → low precedence).
	// Reverse so callers can spread left-to-right with the usual
	// "later wins" semantics.
	return chain.reverse();
}

// ---------- legacy ~/.npmrc deprecation warning ----------

let legacyWarningEmitted = false;
function maybeWarnLegacyNpmrcKeys(npmrcAll) {
	if (legacyWarningEmitted) return;
	const legacy = Object.keys(npmrcAll).filter((k) => k.startsWith("easy-ui5_"));
	if (legacy.length === 0) return;
	legacyWarningEmitted = true;
	// One line on stderr — quiet enough to ignore, loud enough to notice.
	// We deliberately avoid chalk here to keep this module dependency-free.
	process.stderr.write(
		"easy-ui5: found legacy easy-ui5_* keys in ~/.npmrc " + `(${legacy.join(", ")}). These will be ignored in a future release. ` + "Move them to ~/.easyui5rc.json — see README.\n",
	);
}

// ---------- merge ----------

function loadConfig() {
	const userNpmrcPath = process.env.NPM_CONFIG_USERCONFIG || path.join(homedir(), ".npmrc");
	const globalNpmrcPath = process.env.NPM_CONFIG_GLOBALCONFIG;
	const projectNpmrcPath = path.join(process.cwd(), ".npmrc");

	const globalNpmrc = readNpmrc(globalNpmrcPath);
	const userNpmrc = readNpmrc(userNpmrcPath);
	const projectNpmrc = readNpmrc(projectNpmrcPath);

	// Warn once if legacy easy-ui5_* keys still live in ~/.npmrc.
	maybeWarnLegacyNpmrcKeys(userNpmrc.all);

	// Build the easy-ui5_* layer with precedence (low -> high):
	// 1. legacy npmrc easy-ui5_* (one-release grace period, deprecated)
	// 2. easyui5rc cascade (canonical home)
	// 3. EASY_UI5_* env vars (highest — handled in getNPMConfig)
	const easyUi5Layer = {};
	// 1. legacy: pull easy-ui5_* out of user/project .npmrc
	for (const npmrcLayer of [userNpmrc.all, projectNpmrc.all]) {
		for (const [k, v] of Object.entries(npmrcLayer)) {
			if (k.startsWith("easy-ui5_")) easyUi5Layer[k] = v;
		}
	}
	// 2. canonical: walk the .easyui5rc cascade (low -> high precedence)
	const cascade = collectEasyUi5RcCascade(process.cwd());
	for (const { data } of cascade) {
		for (const [k, v] of Object.entries(data)) {
			easyUi5Layer[`easy-ui5_${k}`] = v;
		}
	}

	// Proxy layer from .npmrc (legitimate npm config) and npm_config_*
	const proxyLayer = {
		...globalNpmrc.proxy,
		...userNpmrc.proxy,
		...projectNpmrc.proxy,
		...readEnvNpmConfig(),
	};

	const merged = { ...proxyLayer, ...easyUi5Layer };

	// EASY_UI5_* env vars win over file values. We expand `getNPMConfig` to
	// check these dynamically on each call so we don't need to enumerate
	// every option here.

	// ${ENV_VAR} interpolation on all string values
	for (const k of Object.keys(merged)) {
		merged[k] = expandEnv(merged[k]);
	}
	return merged;
}

// ---------- public API ----------

export default function getNPMConfig(configName, prefix = "easy-ui5_") {
	if (!npmConfig) npmConfig = loadConfig();

	// EASY_UI5_* env vars always win for the easy-ui5_ prefix
	if (prefix === "easy-ui5_") {
		const envName = envVarNameFor(configName);
		const fromEnv = process.env[envName];
		if (fromEnv !== undefined && fromEnv !== "") return fromEnv;
	}

	return npmConfig[`${prefix}${configName}`];
}

// ---------- test hooks ----------

export function _resetCacheForTests() {
	npmConfig = undefined;
	legacyWarningEmitted = false;
}
