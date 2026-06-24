// Tagged logger used across the easy-ui5 runtime.
//
// Each call is prefixed with a fixed-width category tag (`[INFO ]`, `[WARN ]`,
// `[ERROR]`, `[OK   ]`, `[DEBUG]`) so messages line up in the user's terminal.
// The tag is coloured by severity; the message body is passed through
// untouched so existing call sites that already paint individual words with
// chalk keep working.
//
// Routing follows POSIX conventions: `ERROR` and `WARN` go to stderr, everything
// else to stdout. `DEBUG` is suppressed unless `verbose` is enabled.
//
// The logger takes its colorizer (chalk-like) and its sinks by injection so
// tests can render deterministically and capture output without monkey-patching
// globals.

const TAG_WIDTH = 5; // longest tag name: "DEBUG" / "ERROR"

const LEVELS = {
	debug: { name: "DEBUG", colour: "gray", stream: "stdout" },
	info: { name: "INFO", colour: "cyan", stream: "stdout" },
	ok: { name: "OK", colour: "green", stream: "stdout" },
	warn: { name: "WARN", colour: "yellow", stream: "stderr" },
	error: { name: "ERROR", colour: "red", stream: "stderr" },
};

function pad(name) {
	return name.padEnd(TAG_WIDTH, " ");
}

/**
 * Build a tagged logger.
 *
 * @param {object} [opts]
 * @param {object} [opts.chalk] chalk-like colorizer. When omitted the logger
 *   renders without ANSI escapes — handy for tests / non-TTY pipes.
 * @param {boolean} [opts.verbose] Include DEBUG messages when true. Off by default.
 * @param {(s:string)=>void} [opts.stdout] Stdout sink. Defaults to writing to `process.stdout` with a trailing newline.
 * @param {(s:string)=>void} [opts.stderr] Stderr sink. Defaults to writing to `process.stderr` with a trailing newline.
 */
export function createLogger(opts = {}) {
	const chalk = opts.chalk;
	const verbose = !!opts.verbose;
	const stdout = opts.stdout ?? ((line) => process.stdout.write(`${line}\n`));
	const stderr = opts.stderr ?? ((line) => process.stderr.write(`${line}\n`));

	function colour(name, text) {
		const fn = chalk?.[name];
		return typeof fn === "function" ? fn(text) : text;
	}

	function format(levelKey, message) {
		const lvl = LEVELS[levelKey];
		const tag = `[${pad(lvl.name)}]`;
		const colouredTag = colour(lvl.colour, tag);
		return `${colouredTag} ${message}`;
	}

	function emit(levelKey, message) {
		if (levelKey === "debug" && !verbose) return;
		const lvl = LEVELS[levelKey];
		const sink = lvl.stream === "stderr" ? stderr : stdout;
		sink(format(levelKey, message));
	}

	return {
		debug(...args) {
			emit("debug", args.join(" "));
		},
		info(...args) {
			emit("info", args.join(" "));
		},
		ok(...args) {
			emit("ok", args.join(" "));
		},
		warn(...args) {
			emit("warn", args.join(" "));
		},
		error(...args) {
			emit("error", args.join(" "));
		},
		/**
		 * Print a line WITHOUT a category tag. Use for cosmetic output such as
		 * the welcome banner, headers, and the "verbose context" dump where a
		 * `[INFO]` prefix would just add noise.
		 */
		plain(...args) {
			stdout(args.join(" "));
		},
	};
}
