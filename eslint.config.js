import globals from "globals";
import js from "@eslint/js";
import nPlugin from "eslint-plugin-n";
import securityPlugin from "eslint-plugin-security";

export default [
	js.configs.recommended,
	nPlugin.configs["flat/recommended"],
	// security plugin runs as an advisory pass — its findings are warnings,
	// not errors, because they're heuristic. CI still allows --max-warnings 0
	// to surface them, but we don't want every regex to fail a build by default.
	securityPlugin.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
			ecmaVersion: 2024,
			sourceType: "module",
		},
		rules: {
			"block-scoped-var": 2,
			"keyword-spacing": 2,
			"space-unary-ops": 2,
			camelcase: 1,
			"no-warning-comments": 1,
			"no-debugger": 2,
			"default-case": 2,
			"no-unused-vars": 2,
			"no-trailing-spaces": 2,
			semi: [2, "always"],
			quotes: [1, "double"],
			"key-spacing": [
				1,
				{
					beforeColon: false,
				},
			],
			"comma-spacing": [
				1,
				{
					before: false,
					after: true,
				},
			],
			"no-shadow": 2,
			"no-irregular-whitespace": 2,

			// --- hardening rules (built-in, no plugin) ---
			"no-new-require": 2,
			"no-path-concat": 2,
			"no-script-url": 2,
			"require-atomic-updates": 1,

			// Flag dynamic require() — loads code from a non-literal path.
			// The single known offender (loading a plugin module by name) is
			// allow-listed inline; any new occurrence must do the same.
			"no-restricted-syntax": [
				2,
				{
					selector: "CallExpression[callee.name='require'][arguments.0.type!='Literal']",
					message: "Avoid dynamic require() — pass a string literal, or use await import() with a validated URL/path. If unavoidable, add an inline eslint-disable with justification.",
				},
			],

			// --- eslint-plugin-n: keep noise low, enforce engines + safety ---
			"n/no-process-exit": 2,
			"n/no-deprecated-api": 2,
			"n/no-extraneous-import": 2,
			"n/no-extraneous-require": 2,
			"n/no-missing-import": 2,
			// We rely on engines.node — let n verify our usage matches.
			"n/no-unsupported-features/node-builtins": 2,
			// hoist-non-react-statics-style: not all CommonJS interop matters here
			"n/no-unpublished-import": 0,
			"n/no-unpublished-require": 0,

			// --- eslint-plugin-security: advisory (warn) ---
			// These are heuristic and over-trigger; keep as warnings so CI
			// surfaces them via --max-warnings 0 only when CI explicitly opts in.
			"security/detect-object-injection": 0, // far too noisy in practice
			"security/detect-non-literal-fs-filename": 1,
			"security/detect-non-literal-require": 1,
			"security/detect-child-process": 1,
			"security/detect-unsafe-regex": 1,
			"security/detect-eval-with-expression": 2,
			"security/detect-no-csrf-before-method-override": 0,
			"security/detect-buffer-noassert": 2,
			"security/detect-pseudoRandomBytes": 2,
		},
	},
	// --- Tests: lint them too, with mocha globals and relaxed security ---
	{
		files: ["test/**/*.js"],
		ignores: ["test/_/**", "test/generator-ui5-test-v*/**"],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.mocha,
			},
		},
		rules: {
			// fs paths in tests are constructed from __dirname; that's fine.
			"security/detect-non-literal-fs-filename": 0,
			"security/detect-child-process": 0,
			"n/no-unpublished-import": 0,
		},
	},
	{
		ignores: [
			"eslint.config.js",

			// Ignore node_modules
			"node_modules/",

			// Ignore plugin generators (copies of the generators, populated at runtime)
			"plugin-generators/",

			// Ignore the test workdir (_) and all yeoman-generator-version fixtures
			"test/_/",
			"test/generator-ui5-test-v*/",
		],
	},
];
