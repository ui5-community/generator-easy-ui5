# Contributing to Easy UI5

We welcome any type of contribution (code contributions, pull requests, issues) to this easy-ui5 generator equally.

## Analyze Issues

Analyzing issue reports can be a lot of effort. Any help is welcome! Go to the Github [issue tracker](https://github.com/ui5-community/generator-easy-ui5/issues?q=is%3Aopen) and find an open issue which needs additional work or a bugfix.

Additional work may be further information, or a minimized example or gist, or it might be a hint that helps understanding the issue. Maybe you can even find and contribute a bugfix?

## Report an Issue

If you find a bug - behavior of easy-ui5 code contradicting its specification - you are welcome to report it. We can only handle well-reported, actual bugs, so please follow the guidelines below before reporting the issue to the Github [issue tracker](https://github.com/ui5-community/generator-easy-ui5/issues).

### Quick Checklist for Bug Reports

Issue report checklist:

- Real, current bug
- No duplicate
- Reproducible
- Good summary
- Well-documented
- Minimal example
- Use the [template](https://github.com/ui5-community/generator-easy-ui5/issues/new)

### Issue Reporting Disclaimer

We want to improve the quality of easy-ui5 and good bug reports are welcome! But our capacity is limited, so we cannot handle questions or consultation requests and we cannot afford to ask for required details. So we reserve the right to close or to not process insufficient bug reports in favor of those which are very cleanly documented and easy to reproduce. Even though we would like to solve each well-documented issue, there is always the chance that it won't happen - remember: easy-ui5 is Open Source and comes without warranty.

Bug report analysis support is very welcome! (e.g. pre-analysis or proposing solutions)

## Contributing Code

### General Remarks

You are welcome to contribute code to the easy-ui5 generator in order to fix bugs or to implement new features.

My **overall vision for this project** is to support basic scaffolding for multiple runtimes/deployment scenarios. I don’t want to go down the road of providing different templates (List Report, Analytical List Page, etc.) because this will increase the complexity of maintaining the project and makes it more complicated to use. It makes sense to have these features but this should be done by a dedicated development team then. When you look for these features, please check out the [SAP Fiori Tools - Extension Pack](https://marketplace.visualstudio.com/items?itemName=SAPSE.sap-ux-fiori-tools-extension-pack) actually provides a generator that can be used to create Fiori Elements apps that can be published to ABAP systems and SAP BTP. The team is working hard to add more templates in the future.

**Not all proposed contributions can be accepted**. Some features may just fit a third-party add-on better. The code must match the overall direction of the easy-ui5 generator and improve it. So there should be some "bang for the byte". For most bug fixes this is a given, but a major feature implementation first needs to be discussed with one of the committers. Possibly, one who touched the related code or module recently. The more effort you invest, the better you should clarify in advance whether the contribution will match the project's direction. The best way would be to just open an enhancement ticket in the issue tracker to discuss the feature you plan to implement (make it clear that you intend to contribute). We will then forward the proposal to the respective code owner. This avoids disappointment.

### Contributing with AI-generated code

As artificial intelligence evolves, AI-generated code is becoming valuable for many software projects, including open-source initiatives. While we recognize the potential benefits of incorporating AI-generated content into our open-source projects there are certain requirements that need to be reflected and adhered to when making contributions.

Please see our [guideline for AI-generated code contributions to Open Source Software Projects](https://github.com/ui5-community/.github/blob/main/CONTRIBUTING_USING_GENAI.md) for these requirements.

## Developer Certificate of Origin (DCO)

Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this projects, this happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## How to contribute - the Process

Make sure the change would be welcome (e.g. a bugfix or a useful feature); best do so by proposing it in a GitHub issue.

1. Create a branch forking the generator-easy-ui5 repository and do your change.

1. Commit (with a commit message following the [conventional-commit](https://www.conventionalcommits.org/) syntax) and push your changes on that branch.

1. If your change fixes an issue reported at GitHub, add a [keyword](https://help.github.com/articles/closing-issues-using-keywords/) like `fix <issue ID>` to the commit message.

1. **Add a changeset.** Run `npm run changeset` and answer the prompts (semver
   bump + summary), then commit the generated `.changeset/<random-name>.md` file
   alongside your code change. If your PR is docs-only or otherwise doesn't warrant a release, use `npm run changeset:empty`. The [Changesets](.github/workflows/changesets.yml) workflow runs on every PR and fails the check if no changeset is found. See [Release Life-Cycle](#release-life-cycle) below.

1. Create a Pull Request to this repository.

1. Wait for our code review and approval, possibly enhancing your change on request.

Note that the developers also have their regular duties, so depending on the required effort for reviewing, testing and clarification this may take a while.

1. Once the change has been approved we will inform you in a comment.

## Local development

Requires Node.js `>=20.19` (matches `engines.node` in `package.json`).

### Useful scripts

- `npm test` — run the Mocha test suite. Includes unit tests for the
  configuration reader (`test/getNPMConfig.test.js`) and end-to-end generator
  scenarios (`test/basic.js`).
- `npm run lint` — run ESLint locally. Reports the project's flat-config rules
  plus advisory checks from `eslint-plugin-n` and `eslint-plugin-security`.
  Warnings do not fail the local run.
- `npm run lint:ci` — strict variant used by CI: identical rules, but
  `--max-warnings 0` so any new advisory finding fails the build.
- `npm run format` / `npm run format:staged` — Prettier formatting.
- `npm run changeset` — start an interactive Changesets prompt to record the
  semver bump + summary for your PR.
- `npm run changeset:auto` — scan your branch's conventional commits and emit
  one Changesets entry per qualifying commit (`feat:` → minor, `fix:`/`perf:`
  → patch, `!`/`BREAKING CHANGE:` → major). Useful when you've already written
  a tidy commit history. Idempotent: re-runs skip commits an existing changeset
  already references.
- `npm run changeset:empty` — write an empty changeset (no version bump). Use
  for docs-only or tooling-only PRs that still need to pass the changeset gate.
- `npm run changeset:status` — preview what the next release would publish.

### Configuration for local testing

If you need a GitHub token or a custom GitHub host while running the generator
locally (e.g. against an internal SAP GitHub Enterprise instance), put the
values in `~/.easyui5rc.json`:

```json
{
  "ghAuthToken": "ghp_...",
  "ghBaseUrl": "https://github.tools.sap/api/v3"
}
```

For CI use the `EASY_UI5_*` environment variables instead (see the README's
_Configuration_ section). The legacy `easy-ui5_*` keys in `~/.npmrc` are still
read but produce a one-time deprecation warning — please migrate.

### Logging

Diagnostic output goes through the tagged logger at
[generators/app/log.js](generators/app/log.js). Use the appropriate severity
so messages line up cleanly and stream to the right channel:

- `this.logger.debug(...)` — verbose internals (only shown with `--verbose`).
- `this.logger.info(...)` — informational status (cyan `[INFO ]`, stdout).
- `this.logger.ok(...)` — successful operation (green `[OK   ]`, stdout).
- `this.logger.warn(...)` — recoverable / unexpected (yellow `[WARN ]`, stderr).
- `this.logger.error(...)` — fatal or user-actionable failure (red `[ERROR]`, stderr).
- `this.logger.plain(...)` — print a line **without** a category tag. Reserve
  for cosmetic output like banners or formatted help tables.

`this.log(...)` (the Yeoman framework method) is still acceptable for cosmetic
output that goes through Yeoman's adapter (the welcome banner, the `--list`
help table, the `--plugins` info dump). Don't use it — or `console.*` — for
new diagnostic messages.

## Release Life-Cycle

This project uses [Changesets](https://github.com/changesets/changesets) for
versioning and releases. Releases are automated end-to-end:

1. **Author a changeset in your PR.** `npm run changeset` interactively records
   the semver bump (`patch` / `minor` / `major`) and a one-line summary. Commit
   the resulting `.changeset/<random-name>.md` file. Skip with
   `npm run changeset:empty` if the PR doesn't ship anything to users.

2. **Merge to `main`.** The [Release](.github/workflows/release.yml) workflow
   collects every pending changeset and opens — or updates — a single
   `Version Packages` PR. That PR bumps `version` in `package.json` and rewrites
   `CHANGELOG.md` from the changesets.

3. **Merge the `Version Packages` PR.** The same workflow then publishes the
   new version to npm via OIDC Trusted Publishing, creates a matching git tag,
   and cuts a GitHub Release with auto-generated notes.

The workflow can be re-triggered manually from _Actions → Release → Run
workflow_ — useful if the automatic run was skipped (e.g. when a release PR
itself was being merged).

> :information_source: The legacy "bump `package.json` + push a tag" flow has
> been retired. Don't run `npm version` locally; the `Version Packages` PR is
> the only path to a release.
