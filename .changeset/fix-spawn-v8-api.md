---
"generator-easy-ui5": patch
---

Fix subgenerator runs crashing with `Command failed with exit code 1: npm`
after the bump to `yeoman-generator@8`. In v8 the spawn API was reshuffled:
`spawnCommand(name, opts)` now takes a shell string (no args array), while
`spawn(name, args, opts)` is the args-array variant. The generator was
still calling `spawnCommand` with an args array — execa silently dropped
the args and invoked `npm` with nothing, which prints help and exits 1.
Switched the four call sites (`_npmInstall` and the three `git` calls in
`end()`) to `spawn` / `spawnSync`. Added a regression-guard test that fails
if the legacy API reappears anywhere under `generators/`.
