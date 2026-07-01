---
"generator-easy-ui5": minor
---

Require Node.js 22.13 or higher

The minimum supported Node.js version is now `>=22.13` (previously `>=20.19`).
Node 20 has moved out of Active LTS and the UI5 ecosystem is standardising on
Node 22 as the common floor; the exact `22.13` threshold matches the range
already required by our transitive dependencies (yeoman-generator, glob, and
others).

- CI now tests on Node **22, 24, and 26**.
- `lint-staged` bumped to 17 (drops Node 20 support).
- `@commitlint/cli` and `@commitlint/config-conventional` bumped to 21.
- `globals` bumped to 17.7.
- Pinned GitHub Action SHAs refreshed (`actions/checkout` v7,
  `actions/setup-node` v6, `changesets/action` v1.9, `softprops/action-gh-release` v3).
