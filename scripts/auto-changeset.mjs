// Auto-generate Changesets entries from conventional commits.
//
// `generator-easy-ui5` is a single-package repo, so every entry targets the
// same package; this script walks the configured commit range and emits one
// .changeset/auto-<short-sha>.md per qualifying commit. The CLI is a faster
// path than `npm run changeset` for the common case where the commit message
// already encodes the bump:
//
//     fix:                    -> patch
//     feat:                   -> minor
//     `!` / BREAKING CHANGE:  -> major
//
// Usage:
//   npm run changeset:auto                 # commits ahead of origin/main
//   npm run changeset:auto -- --since=<ref>
//   npm run changeset:auto -- --dry-run    # print, don't write
//   npm run changeset:auto -- --verbose    # log per-commit decisions
//
// Skip rules:
//   - commits whose `type` is one of: chore, ci, build, docs, style, test,
//     refactor (these don't change runtime behaviour)
//   - merge commits
//   - commits a human already authored a changeset for. A commit is skipped
//     when any existing .changeset/*.md mentions its short SHA in the summary
//     line (the format produced by this script).

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const CHANGESET_DIR = join(REPO_ROOT, ".changeset");

// --- CLI args ----------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const verbose = args.includes("--verbose");
const sinceArg = args.find((a) => a.startsWith("--since="))?.slice("--since=".length);

// --- helpers -----------------------------------------------------------------

function git(...gitArgs) {
	return execFileSync("git", gitArgs, { cwd: REPO_ROOT, encoding: "utf8" }).trimEnd();
}

function gitOptional(...gitArgs) {
	try {
		return git(...gitArgs);
	} catch {
		return null;
	}
}

function log(...msg) {
	if (verbose) console.log(...msg);
}

// --- single-package metadata -------------------------------------------------

const ROOT_PKG = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8"));
const PACKAGE_NAME = ROOT_PKG.name;

// --- existing changesets -----------------------------------------------------

// Find SHAs already referenced by an existing .changeset/*.md entry so we don't
// double-write. We look for the literal trailing `(<short-sha>)` we emit below.
function loadExistingShortShas() {
	if (!existsSync(CHANGESET_DIR)) return new Set();
	const seen = new Set();
	for (const entry of readdirSync(CHANGESET_DIR)) {
		if (!entry.endsWith(".md") || entry === "README.md") continue;
		const text = readFileSync(join(CHANGESET_DIR, entry), "utf8");
		for (const match of text.matchAll(/\(([0-9a-f]{7,40})\)/g)) {
			seen.add(match[1].slice(0, 7));
		}
	}
	return seen;
}

// --- commit walk -------------------------------------------------------------

function resolveSinceRef() {
	if (sinceArg) return sinceArg;
	// Prefer the merge-base with origin/main so this works locally on PR
	// branches and in CI where the workflow checks out the full history.
	const mergeBase = gitOptional("merge-base", "HEAD", "origin/main");
	if (mergeBase) return mergeBase;
	// Fallbacks for shallow / fresh clones
	return gitOptional("rev-list", "--max-parents=0", "HEAD") || "HEAD~10";
}

const SINCE = resolveSinceRef();
log(`Walking commits in range ${SINCE}..HEAD`);

function listCommits(range) {
	const raw = gitOptional("log", "--no-merges", "--reverse", `--format=%H%x00%s%x00%b%x1e`, range);
	if (!raw) return [];
	return raw
		.split("\x1e")
		.map((s) => s.trim())
		.filter(Boolean)
		.map((entry) => {
			const [sha, subject, body] = entry.split("\x00");
			return { sha, subject: (subject || "").trim(), body: (body || "").trim() };
		});
}

// Conventional-commit regex: `type(scope)!: subject`
const SUBJECT_RE = /^(?<type>[a-zA-Z]+)(?:\((?<scope>[^)]+)\))?(?<bang>!)?:\s*(?<title>.+)$/;
const RELEASEABLE_TYPES = new Set(["feat", "fix", "perf"]);
const SKIPPED_TYPES = new Set(["chore", "ci", "build", "docs", "style", "test", "refactor", "revert"]);

function bumpFor(parsed, body) {
	if (parsed.bang || /^BREAKING CHANGE:/m.test(body)) return "major";
	if (parsed.type === "feat") return "minor";
	if (parsed.type === "fix" || parsed.type === "perf") return "patch";
	return null;
}

// --- main --------------------------------------------------------------------

function main() {
	const commits = listCommits(`${SINCE}..HEAD`);
	if (commits.length === 0) {
		console.log("No commits found in range — nothing to do.");
		return;
	}

	const existingShas = loadExistingShortShas();

	let written = 0;
	let skipped = 0;

	for (const commit of commits) {
		const short = commit.sha.slice(0, 7);

		const match = commit.subject.match(SUBJECT_RE);
		if (!match) {
			log(`  skip ${short}: not a conventional-commit subject (${commit.subject})`);
			skipped++;
			continue;
		}
		const parsed = match.groups;

		if (SKIPPED_TYPES.has(parsed.type)) {
			log(`  skip ${short}: type=${parsed.type} (non-releaseable)`);
			skipped++;
			continue;
		}
		if (!RELEASEABLE_TYPES.has(parsed.type) && !parsed.bang) {
			log(`  skip ${short}: unknown type=${parsed.type}`);
			skipped++;
			continue;
		}

		const bump = bumpFor(parsed, commit.body);
		if (!bump) {
			log(`  skip ${short}: no bump derived from type=${parsed.type}`);
			skipped++;
			continue;
		}

		if (existingShas.has(short)) {
			log(`  skip ${short}: existing changeset already references this commit`);
			skipped++;
			continue;
		}

		const title = parsed.title.trim().replace(/[.\s]+$/, "");
		const summary = `${title} (${short})`;
		const fileName = `auto-${short}.md`;
		const filePath = join(CHANGESET_DIR, fileName);

		const body = `---
"${PACKAGE_NAME}": ${bump}
---

${summary}
`;

		if (dryRun) {
			console.log(`-- would write ${fileName}\n${body}`);
		} else {
			if (!existsSync(CHANGESET_DIR)) mkdirSync(CHANGESET_DIR, { recursive: true });
			writeFileSync(filePath, body);
			console.log(`wrote .changeset/${fileName} (${bump}: ${title})`);
		}
		written++;
	}

	console.log(`\nDone: ${written} written, ${skipped} skipped.`);
}

main();
