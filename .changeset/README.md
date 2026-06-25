# Changesets

This folder is managed by [`@changesets/cli`](https://github.com/changesets/changesets).
Changesets drive every release of `generator-easy-ui5` — they decide whether to cut a
patch, minor, or major, generate the `CHANGELOG.md` entry, and trigger the publish
to npm.

## How this repo uses Changesets

`generator-easy-ui5` is a single-package repo, so most of the monorepo machinery of
Changesets is unused. The flow is:

1. **In your PR**, run `npm run changeset` and answer the prompts (semver bump +
   summary). Commit the generated `.changeset/<random-name>.md` file alongside your
   code change.
2. When your PR merges to `main`, the [Release](../.github/workflows/release.yml)
   workflow opens (or updates) a single `Version Packages` PR that bumps the version
   in `package.json` and updates `CHANGELOG.md` to consume all pending changesets.
3. **Merging the `Version Packages` PR** triggers the same workflow to publish the
   new version to npm via OIDC Trusted Publishing.

If a change does not warrant a release (docs-only edits, internal tooling, CI tweaks,
test refactors), use `npm run changeset:empty` instead to write an empty changeset so
the PR's "needs changeset" gate passes.

For commits that already encode the semver bump in their conventional-commit message
(`feat:` → minor, `fix:` → patch, `!`/`BREAKING CHANGE:` → major), you can let
`npm run changeset:auto` walk the commit history and write an entry per qualifying
commit — see `scripts/auto-changeset.mjs`.
