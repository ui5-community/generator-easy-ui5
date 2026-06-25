---
"generator-easy-ui5": minor
---

Introduce a structured logger with severity-tagged, colour-coded output.
Every diagnostic line emitted by the generator now carries a fixed-width
category — `[INFO ]`, `[WARN ]`, `[ERROR]`, `[OK   ]`, or `[DEBUG]` — coloured
by severity (cyan / yellow / red / green / dim). `WARN` and `ERROR` are
routed to `stderr` so they survive `stdout` redirects; `DEBUG` is hidden
unless `--verbose` is set. The previous mix of `this.log`, `console.error`,
`console.info`, and raw `process.stderr.write` calls has been replaced with
`this.logger.{info,warn,error,ok,debug}` across `generators/app/index.js`
and the legacy `~/.npmrc` deprecation notice in `getNPMConfig.js`. The
welcome banner and the `--list` / `--plugins` help output still use the
untagged `this.log` channel because they're cosmetic, not diagnostic.
