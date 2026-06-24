// Renders the easy-ui5 welcome banner.
//
// A box-drawing wordmark in the ANSI-Shadow style spelling out
// `EASY UI5`, rendered in a six-row rainbow when a chalk-style colorizer
// is supplied. A small heart in the same block style sits on the top
// right; an empty row separates the heart from the version which is
// printed on the wordmark's last row. The banner is bracketed by blank
// lines so it has visual breathing room when log output streams above
// and below it.

const WORDMARK = [
	"███████╗ █████╗ ███████╗██╗   ██╗   ██╗   ██╗██╗███████╗",
	"██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝   ██║   ██║██║██╔════╝",
	"█████╗  ███████║███████╗ ╚████╔╝    ██║   ██║██║███████╗",
	"██╔══╝  ██╔══██║╚════██║  ╚██╔╝     ██║   ██║██║╚════██║",
	"███████╗██║  ██║███████║   ██║      ╚██████╔╝██║███████║",
	"╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝       ╚═════╝ ╚═╝╚══════╝",
];

// One chalk colour per wordmark row — six rows, six rainbow tones.
const RAINBOW = ["red", "yellow", "green", "cyan", "blue", "magenta"];

// Small 4-row heart, anchored to the right of the wordmark's top half.
// Aligned manually so it visually rests against the wordmark with a small
// gap. Width includes leading spaces so each row has identical length.
const HEART = ["   ▄▄ ▄▄ ", "   █████ ", "    ███  ", "     █   "];

const WORDMARK_WIDTH = 56;
const HEART_GAP = 2; // spaces between the wordmark and the heart
const HEART_WIDTH = HEART[0].length;
const BANNER_WIDTH = WORDMARK_WIDTH + HEART_GAP + HEART_WIDTH;
const INDENT = "  ";
// The version sits on the last wordmark row, leaving the row between the
// heart and the version blank for a bit of breathing space.
const VERSION_ROW_INDEX = WORDMARK.length - 1;

/**
 * @param {string} version The generator version to render under the heart.
 * @param {Partial<Record<"red"|"yellow"|"green"|"cyan"|"blue"|"magenta", (s:string)=>string>>} [c]
 *        Optional chalk-like colorizer. When omitted the banner renders
 *        without ANSI escapes.
 * @returns {string}
 */
export function renderBanner(version, c) {
	const id = (s) => s;
	const rainbow = RAINBOW.map((name) => c?.[name] ?? id);
	const yellow = c?.yellow ?? id;
	// The heart accent uses magenta as a pink fallback against any of the
	// rainbow rows it overlaps. Fall back to red if the caller didn't
	// supply magenta.
	const pink = c?.magenta ?? c?.red ?? id;

	const versionText = `v${version}`;
	// Centre the version under the heart by padding it to the heart's width.
	const versionRow = centerInWidth(versionText, HEART_WIDTH);

	const lines = WORDMARK.map((line, i) => {
		const colorize = rainbow[i] ?? id;
		const heart = HEART[i];
		const wordmark = `${INDENT}${colorize(line)}`;
		if (heart) {
			return `${wordmark}${" ".repeat(HEART_GAP)}${pink(heart)}`;
		}
		if (i === VERSION_ROW_INDEX) {
			return `${wordmark}${" ".repeat(HEART_GAP)}${yellow(versionRow)}`;
		}
		return wordmark;
	});

	// Bracket the banner with blank lines so log output above and below has
	// some breathing space.
	return ["", ...lines, ""].join("\n");
}

function centerInWidth(text, width) {
	if (text.length >= width) return text;
	const pad = width - text.length;
	const left = Math.floor(pad / 2);
	const right = pad - left;
	return `${" ".repeat(left)}${text}${" ".repeat(right)}`;
}

// Exported for tests that need the design constants without running render.
export const _internals = {
	WORDMARK_WIDTH,
	WORDMARK_HEIGHT: WORDMARK.length,
	HEART_WIDTH,
	HEART_HEIGHT: HEART.length,
	BANNER_WIDTH,
	RAINBOW,
	VERSION_ROW_INDEX,
};
