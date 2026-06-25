import assert from "node:assert/strict";

import { renderBanner } from "../generators/app/banner.js";

describe("renderBanner", function () {
	it("renders the EASY UI5 wordmark", function () {
		const out = renderBanner("9.9.9");
		assert.match(out, /███████/, "wordmark block letters must be present");
	});

	it("places the version on the last wordmark row, with a blank row between heart and version", function () {
		const out = renderBanner("9.9.9");
		assert.match(out, /v9\.9\.9/, "rendered version must come from the argument");
		const lines = out.split("\n");
		// 1 blank above + 6 wordmark rows + 1 blank below = 8 lines total.
		assert.equal(lines.length, 8, `expected 8 lines, got ${lines.length}`);
		// The first and last lines are blank.
		assert.equal(lines[0], "", "banner must start with a blank line");
		assert.equal(lines[lines.length - 1], "", "banner must end with a blank line");
		// The version appears on the last wordmark row (the 6th wordmark row,
		// i.e. index 6 in the bracketed output) — leaving the row above
		// (index 5) free of any heart/version glyphs so the heart cluster
		// has breathing space. We test the slice AFTER the wordmark prefix
		// to avoid matching the wordmark's own `█` glyphs.
		assert.match(lines[6], /v9\.9\.9/, "version must sit on the last wordmark row");
		assert.doesNotMatch(lines[5], /v9\.9\.9/, "the row above the version must not carry the version");
		const wordmarkPrefixLen = "  ".length + 56; // INDENT + WORDMARK_WIDTH
		const rightOfWordmark = lines[5].slice(wordmarkPrefixLen);
		assert.doesNotMatch(rightOfWordmark, /[▄█]/, "the heart/version column on row 5 must be empty for breathing room");
	});

	it("includes the heart accent on the top right", function () {
		const out = renderBanner("9.9.9");
		assert.match(out, /▄▄ ▄▄/, "top of the heart must be present");
		assert.match(out, /█████/, "body of the heart must be present");
	});

	it("renders without colour when no colorizer is provided", function () {
		const out = renderBanner("9.9.9");
		// eslint-disable-next-line no-control-regex
		assert.doesNotMatch(out, /\[/, "no ANSI escapes should be emitted");
	});

	it("paints each wordmark row with a different rainbow colour", function () {
		const tag = (name) => (s) => `<${name}>${s}</${name}>`;
		const out = renderBanner("9.9.9", {
			red: tag("red"),
			yellow: tag("yellow"),
			green: tag("green"),
			cyan: tag("cyan"),
			blue: tag("blue"),
			magenta: tag("magenta"),
		});
		for (const name of ["red", "yellow", "green", "cyan", "blue", "magenta"]) {
			assert.ok(out.includes(`<${name}>`), `wordmark must contain a row coloured ${name}`);
		}
	});

	it("colours the heart with magenta when provided", function () {
		const mag = (s) => `<M>${s}</M>`;
		const red = (s) => `<R>${s}</R>`;
		const out = renderBanner("9.9.9", { red, magenta: mag, yellow: (s) => s, cyan: (s) => s });
		assert.match(out, /<M>.*▄.*<\/M>/, "heart must be wrapped by the magenta colorizer when available");
	});

	it("colours the version under the heart with yellow when provided", function () {
		const yellow = (s) => `<Y>${s}</Y>`;
		const out = renderBanner("9.9.9", { yellow, red: (s) => s, magenta: (s) => s, cyan: (s) => s });
		assert.match(out, /<Y>[^<]*v9\.9\.9[^<]*<\/Y>/, "version must be wrapped by the yellow colorizer");
	});

	it("keeps the banner inside 80 columns", function () {
		const out = renderBanner("999.999.999"); // worst-case version width
		for (const [i, line] of out.split("\n").entries()) {
			assert.ok(line.length <= 80, `line ${i} exceeds 80 columns (${line.length}): "${line}"`);
		}
	});
});
