---
"generator-easy-ui5": minor
---

Replace the standard Yeoman `yosay` greeting with a branded **EASY UI5**
ASCII banner. The wordmark spells "Easy UI5" in ANSI-Shadow box-drawing
characters with a small block-style heart anchored to the top right.
Wordmark rows are painted with a six-tone rainbow (red, yellow, green,
cyan, blue, magenta); the heart renders in magenta; the version number
sits on the last wordmark row in yellow, with a blank row separating it
from the heart for visual breathing room. Blank lines bracket the banner
above and below. The `yosay` runtime dependency has been dropped (it
remains a devDependency only because the in-tree test-plugin fixtures
still use it).
