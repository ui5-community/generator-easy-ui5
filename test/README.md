# Easy UI5 Generator Test Scenarios

In the root directory of Easy UI5 just execute the following commands and check that it is working.

## Scenario 1: Standard Usage

Retrieve the list of generators from the `ui5-community` GitHub organisation:

```sh
yo ./
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Select your generator? (Use arrow keys)
❯ library
  middleware
  task
  control
  project
  app
  ts-app
  flp-plugin
```

By specifying an `addGhOrg` additional entries should be displayed:

```sh
yo ./ --addGhOrg=petermuessig
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Select your generator? (Use arrow keys)
❯ library [ui5-community]
  middleware [ui5-community]
  task [ui5-community]
  control [ui5-community]
  project [ui5-community]
  app [ui5-community]
  ts-app [ui5-community]
  flp-plugin [ui5-community]
```

## Scenario 2: Next Usage

Retrieve the list of generators from bestofui5.org:

```sh
yo ./ --next
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? Select your generator? (Use arrow keys)
❯ project
  ts-app
  ts-app-fcl
  flp-plugin
  library
  control
```

## Scenario 3: Offline Usage

Retrieve the list of generators from bestofui5.org:

```sh
yo ./ --offline
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

Running in offline mode!
? Select your generator? (Use arrow keys)
❯ library
  project
  ts-app
```

## Scenario 4: Generator From GitHub Repository

```sh
yo ./ SAP-samples/ui5-typescript-tutorial
```

Expected result:

```sh
     _-----_
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Welcome to the easy-ui5 │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? How do you want to name this application? (myapp)
```

## Scenario 5: Configuration via `~/.easyui5rc.json`

The generator reads its custom options (GitHub token, alternate GitHub host,
additional org, etc.) from `~/.easyui5rc.json` (preferred) or `~/.easyui5rc`
(INI). A per-project override may be placed in the current working directory,
and the cascade walks upward ESLint-style until it hits a file with
`"root": true` or your home directory.

To exercise the reader, drop a file like the following into `~/.easyui5rc.json`:

```json
{
  "ghAuthToken": "ghp_replace-with-a-real-token",
  "addGhOrg": "petermuessig"
}
```

Then run:

```sh
yo ./
```

Expected result: the generators from the `addGhOrg` show up in the list (same
as `--addGhOrg=petermuessig`), and authenticated GitHub calls succeed without
hitting the unauthenticated rate limit.

For CI use the `EASY_UI5_*` environment variables instead (see the project
README). Example:

```sh
EASY_UI5_GH_AUTH_TOKEN=ghp_... yo ./
```

### Legacy `~/.npmrc` keys

If `~/.npmrc` still contains `easy-ui5_*` keys from a previous version of the
generator, the values are still honoured for one release. The generator prints
a one-line migration notice on stderr — move the keys to `~/.easyui5rc.json`
to silence both that notice and npm's own _"Unknown user config"_ warning.

## Scenario 6: Changesets Workflow

The repo uses [Changesets](https://github.com/changesets/changesets) to drive
releases. After making a change, exercise the contributor flow:

```sh
# Interactive: pick semver bump + write summary
npm run changeset

# Or: derive entries from your conventional commits
npm run changeset:auto -- --dry-run --verbose

# Or: empty changeset for docs/tooling-only PRs
npm run changeset:empty

# Preview what the next release would publish
npm run changeset:status
```

Expected result: a `.changeset/<random-or-auto>-*.md` file is created (or
listed, with `--dry-run`). Commit the file alongside your PR — the
[Changesets](../.github/workflows/changesets.yml) workflow fails the check on
any PR that doesn't include a `.changeset/*.md` entry.

See [CONTRIBUTING.md](../CONTRIBUTING.md#release-life-cycle) for the full
release life-cycle.
