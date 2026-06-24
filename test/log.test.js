import assert from "node:assert/strict";

import { createLogger } from "../generators/app/log.js";

function makeRecorder() {
	const out = [];
	const err = [];
	return {
		out,
		err,
		stdout: (line) => out.push(line),
		stderr: (line) => err.push(line),
	};
}

describe("createLogger", function () {
	it("prefixes each message with its fixed-width tag", function () {
		const rec = makeRecorder();
		const log = createLogger({ stdout: rec.stdout, stderr: rec.stderr });
		log.info("hello");
		log.warn("careful");
		log.error("boom");
		log.ok("done");
		assert.deepEqual(rec.out, ["[INFO ] hello", "[OK   ] done"]);
		assert.deepEqual(rec.err, ["[WARN ] careful", "[ERROR] boom"]);
	});

	it("routes WARN and ERROR to stderr, everything else to stdout", function () {
		const rec = makeRecorder();
		const log = createLogger({ stdout: rec.stdout, stderr: rec.stderr });
		log.info("a");
		log.ok("b");
		log.warn("c");
		log.error("d");
		assert.equal(rec.out.length, 2);
		assert.equal(rec.err.length, 2);
	});

	it("suppresses DEBUG unless verbose is set", function () {
		const rec = makeRecorder();
		const quiet = createLogger({ stdout: rec.stdout, stderr: rec.stderr });
		quiet.debug("hidden");
		assert.deepEqual(rec.out, []);

		const rec2 = makeRecorder();
		const verbose = createLogger({ stdout: rec2.stdout, stderr: rec2.stderr, verbose: true });
		verbose.debug("shown");
		assert.deepEqual(rec2.out, ["[DEBUG] shown"]);
	});

	it("colours the tag with the level's colorizer when chalk is provided", function () {
		const rec = makeRecorder();
		const chalk = {
			cyan: (s) => `<c>${s}</c>`,
			yellow: (s) => `<y>${s}</y>`,
			red: (s) => `<r>${s}</r>`,
			green: (s) => `<g>${s}</g>`,
			gray: (s) => `<d>${s}</d>`,
		};
		const log = createLogger({ chalk, stdout: rec.stdout, stderr: rec.stderr, verbose: true });
		log.info("hi");
		log.warn("hi");
		log.error("hi");
		log.ok("hi");
		log.debug("hi");
		assert.deepEqual(rec.out, ["<c>[INFO ]</c> hi", "<g>[OK   ]</g> hi", "<d>[DEBUG]</d> hi"]);
		assert.deepEqual(rec.err, ["<y>[WARN ]</y> hi", "<r>[ERROR]</r> hi"]);
	});

	it("plain() prints without a tag", function () {
		const rec = makeRecorder();
		const log = createLogger({ stdout: rec.stdout, stderr: rec.stderr });
		log.plain("banner line 1");
		assert.deepEqual(rec.out, ["banner line 1"]);
	});

	it("joins multiple arguments with a single space, console-style", function () {
		const rec = makeRecorder();
		const log = createLogger({ stdout: rec.stdout, stderr: rec.stderr });
		log.info("a", "b", "c");
		assert.equal(rec.out[0], "[INFO ] a b c");
	});
});
