---
"generator-easy-ui5": patch
---

Fix scaffolding interactive flow:

- Drop `--prefer-offline` from the internal `npm install` invocation; the flag could prevent the install from completing properly when the offline cache is incomplete or stale.
- Replace the deprecated inquirer `list` prompt type with `select` for the generator and sub-generator selection prompts.
