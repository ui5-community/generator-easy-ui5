---
"generator-easy-ui5": patch
---

Expand the integration-test matrix to cover **every supported yeoman-generator
major (4, 5, 6, 7, 8)**. Each fixture under `test/generator-ui5-test-v<N>/`
pins its own `yeoman-generator` major and produces a distinctively-named
template file the assertion can check for, so a regression in any major
surfaces immediately. The corresponding test driver in `test/basic.js` is now
data-driven (one row per major) so adding a future yeoman-generator major
becomes a one-line change. Also fixes a latent `chalk`-not-imported bug in
the v4/v5 fixtures that would have crashed if the `--embedded` option was
ever off.
