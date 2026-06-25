---
"generator-easy-ui5": patch
---

Move the `--embed` plugin-generator snapshotting step out of the
`prepublishOnly` npm hook and into an explicit `npm run embed` workflow
step that runs **before** Changesets publishes. The previous setup
called `npx yo … --embed` from inside `npm publish`, which fetched the
public plugin generators from GitHub without authentication — at the
mercy of the 60-req/hour unauthenticated rate limit on shared CI egress
IPs. With the new arrangement: the release workflow authenticates the
fetch via `EASY_UI5_GH_AUTH_TOKEN=${{ secrets.GITHUB_TOKEN }}`, and a
transient GitHub failure aborts the run before any version bump is
committed to `main`. Maintainers publishing locally (rare; the workflow
is the intended path) now need to run `npm run embed` themselves first —
see `CONTRIBUTING.md`'s "Release Life-Cycle" section.
