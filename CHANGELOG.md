## [3.8.2](https://github.com/ui5-community/generator-easy-ui5/compare/v3.7.0...v3.8.2) (2025-07-23)

### Bug Fixes

- ensure proper support for corporate proxies ([#143](https://github.com/ui5-community/generator-easy-ui5/issues/143)) ([c99ab14](https://github.com/ui5-community/generator-easy-ui5/commit/c99ab14049e3b9dbe05fdca70674d1717e1544bd)), closes [#142](https://github.com/ui5-community/generator-easy-ui5/issues/142)
- prepublish script ([9485829](https://github.com/ui5-community/generator-easy-ui5/commit/9485829462d2407cedd9930d2d445e7e24a22de4))

### Features

- support nesting of generators ([#141](https://github.com/ui5-community/generator-easy-ui5/issues/141)) ([afd9173](https://github.com/ui5-community/generator-easy-ui5/commit/afd9173ad8b2450281b00147d3b071d3bb989656))

# [3.7.0](https://github.com/ui5-community/generator-easy-ui5/compare/v3.5.1...v3.7.0) (2023-11-29)

### Bug Fixes

- also include embedded subgens ([86912a8](https://github.com/ui5-community/generator-easy-ui5/commit/86912a8cb4736ea8950696de14ce20e87056246f))
- await Environment.lookup ([#132](https://github.com/ui5-community/generator-easy-ui5/issues/132)) ([#133](https://github.com/ui5-community/generator-easy-ui5/issues/133)) ([9f614d2](https://github.com/ui5-community/generator-easy-ui5/commit/9f614d21d8f22019de579aa03406806cb533d5a6))
- ignore execution of scripts to avoid husky run ([#129](https://github.com/ui5-community/generator-easy-ui5/issues/129)) ([3da8d22](https://github.com/ui5-community/generator-easy-ui5/commit/3da8d221659fe80bfd8f0a5d10275d2736ee9125))
- just use npm to install subgen dependencies ([#130](https://github.com/ui5-community/generator-easy-ui5/issues/130)) ([6697913](https://github.com/ui5-community/generator-easy-ui5/commit/6697913e03b2a188e2389ab777bb751d02fbc59b))
- omit devDependencies for plugin generators ([#125](https://github.com/ui5-community/generator-easy-ui5/issues/125)) ([ffda0c5](https://github.com/ui5-community/generator-easy-ui5/commit/ffda0c5048543bdb29956bdde01730af4fee74fb))
- removal of the outdated templates must not fail ([#126](https://github.com/ui5-community/generator-easy-ui5/issues/126)) ([f196dac](https://github.com/ui5-community/generator-easy-ui5/commit/f196dac643a947c26081437b08673151f6536523))
- sort subgen list, remove threshold, fix permission issues ([#123](https://github.com/ui5-community/generator-easy-ui5/issues/123)) ([c5dd321](https://github.com/ui5-community/generator-easy-ui5/commit/c5dd3218a26870a61722a9675a81831cc8af50e5)), closes [#122](https://github.com/ui5-community/generator-easy-ui5/issues/122) [#118](https://github.com/ui5-community/generator-easy-ui5/issues/118) [#117](https://github.com/ui5-community/generator-easy-ui5/issues/117) [#111](https://github.com/ui5-community/generator-easy-ui5/issues/111)

### Features

- support for coporate proxy / switch to esm / update deps ([#124](https://github.com/ui5-community/generator-easy-ui5/issues/124)) ([bf95254](https://github.com/ui5-community/generator-easy-ui5/commit/bf95254694025f3d22e5af37bb610ba7d2a0e215)), closes [#79](https://github.com/ui5-community/generator-easy-ui5/issues/79)
- update the min nodejs version to 18 ([06385f4](https://github.com/ui5-community/generator-easy-ui5/commit/06385f44d4de6b31f3cb25e6cd2a1bd74117b685))

## [3.5.1](https://github.com/ui5-community/generator-easy-ui5/compare/v3.2.0...v3.5.1) (2022-09-10)

### Bug Fixes

- enable for Yeoman UI usage ([03c2e38](https://github.com/ui5-community/generator-easy-ui5/commit/03c2e38af4eebe108d6076710b74d8aaf7c31d8d))
- **postinstall:** allow usage of NPM config for ghAuthToken to avoid rate limit ([#104](https://github.com/ui5-community/generator-easy-ui5/issues/104)) ([371d7fb](https://github.com/ui5-community/generator-easy-ui5/commit/371d7fbc82b8a59cef896197b99239b505b3cd90)), closes [#100](https://github.com/ui5-community/generator-easy-ui5/issues/100)
- **postinstall:** avoid non-existing node_modules ([#98](https://github.com/ui5-community/generator-easy-ui5/issues/98)) ([f93c7c9](https://github.com/ui5-community/generator-easy-ui5/commit/f93c7c99b9e5df7af801a085afe72be85e462007))
- usage of proper gh org for logging and download ([#94](https://github.com/ui5-community/generator-easy-ui5/issues/94)) ([a88d4db](https://github.com/ui5-community/generator-easy-ui5/commit/a88d4dbb0a1f5ed3cf60f7ed0297c651222a83fb))
- use the org name of the selected generator for downloading the corresponding repo ([d9ca4dc](https://github.com/ui5-community/generator-easy-ui5/commit/d9ca4dc3170e0507199799d2e14db327cba4d871))

### Features

- allow ghAuthToken as NPM configuration ([#103](https://github.com/ui5-community/generator-easy-ui5/issues/103)) ([5e3d928](https://github.com/ui5-community/generator-easy-ui5/commit/5e3d92807e881d0ade80251bc8cc1bdde85142be))
- allow to run easy-ui5 embedded ([#99](https://github.com/ui5-community/generator-easy-ui5/issues/99)) ([f4952c4](https://github.com/ui5-community/generator-easy-ui5/commit/f4952c442c9563a51c48b8edc25843f097fce4c4))
- offline support, generator from repo, bestofui5 test ([#110](https://github.com/ui5-community/generator-easy-ui5/issues/110)) ([70e9012](https://github.com/ui5-community/generator-easy-ui5/commit/70e9012d85bee0c2ac2dadfe3ca9cac3d297ce84))

# [3.2.0](https://github.com/ui5-community/generator-easy-ui5/compare/v3.1.5...v3.2.0) (2022-02-03)

### Bug Fixes

- freeze version of colors.js in package.json ([#85](https://github.com/ui5-community/generator-easy-ui5/issues/85)) ([6b497b6](https://github.com/ui5-community/generator-easy-ui5/commit/6b497b6c05748b8f67617c6399a11f8e8d850d48))
- use homedir for plugin-generators avoid EACCESS ([e326676](https://github.com/ui5-community/generator-easy-ui5/commit/e326676458f439f9ac01498381059229a897fa61)), closes [#84](https://github.com/ui5-community/generator-easy-ui5/issues/84)

### Features

- Add support for user repositories ([6b7efa6](https://github.com/ui5-community/generator-easy-ui5/commit/6b7efa63414c31d76a53ee1b069557c527077f39))
- support additional GH org via NPM config ([0d33197](https://github.com/ui5-community/generator-easy-ui5/commit/0d33197098e010858d1ea7a0e4b172d5d6a5aa22))

## [3.1.5](https://github.com/ui5-community/generator-easy-ui5/compare/v3.1.4...v3.1.5) (2022-01-10)

### Bug Fixes

- re-enable sub-generator update check ([c464bd1](https://github.com/ui5-community/generator-easy-ui5/commit/c464bd11d2cf32006fd7f42ea8f15a736cb10271))

## [3.1.4](https://github.com/ui5-community/generator-easy-ui5/compare/v3.1.3...v3.1.4) (2021-12-07)

### Bug Fixes

- disable autoinstall of Yeoman 5.x ([de6fcaf](https://github.com/ui5-community/generator-easy-ui5/commit/de6fcafd164734a9e3fbbab599b7376a49fffe89))

## [3.1.3](https://github.com/ui5-community/generator-easy-ui5/compare/v3.1.2...v3.1.3) (2021-11-25)

## [3.1.2](https://github.com/ui5-community/generator-easy-ui5/compare/v3.1.1...v3.1.2) (2021-11-23)

## [3.1.1](https://github.com/ui5-community/generator-easy-ui5/compare/v3.1.0...v3.1.1) (2021-11-23)

# [3.1.0](https://github.com/ui5-community/generator-easy-ui5/compare/v3.0.3...v3.1.0) (2021-11-23)

## [3.0.3](https://github.com/ui5-community/generator-easy-ui5/compare/v3.0.2...v3.0.3) (2021-11-15)

## [3.0.2](https://github.com/ui5-community/generator-easy-ui5/compare/v3.0.1...v3.0.2) (2021-11-15)

## [3.0.1](https://github.com/ui5-community/generator-easy-ui5/compare/v2.4.6...v3.0.1) (2021-05-10)

## [2.4.6](https://github.com/ui5-community/generator-easy-ui5/compare/2.4.6...v2.4.6) (2021-02-10)

### Bug Fixes

- uiveri5 reporters ([f2e2d6d](https://github.com/ui5-community/generator-easy-ui5/commit/f2e2d6dae71dc580ee0d15c42baafe06ae983d4e))

## [2.4.5](https://github.com/ui5-community/generator-easy-ui5/compare/2.4.5...v2.4.5) (2021-01-29)

### Bug Fixes

- opa test namespace and folder ([fb166b7](https://github.com/ui5-community/generator-easy-ui5/commit/fb166b7df06b7cd465366726ed484890ad389d96))

## [2.4.4](https://github.com/ui5-community/generator-easy-ui5/compare/2.4.4...v2.4.4) (2021-01-25)

## [2.4.3](https://github.com/ui5-community/generator-easy-ui5/compare/2.4.3...v2.4.3) (2021-01-08)

## [2.4.2](https://github.com/ui5-community/generator-easy-ui5/compare/2.4.2...v2.4.2) (2020-12-18)

## [2.4.1](https://github.com/ui5-community/generator-easy-ui5/compare/v2.4.0...v2.4.1) (2020-12-18)

# [2.4.0](https://github.com/ui5-community/generator-easy-ui5/compare/v2.3.0...v2.4.0) (2020-12-10)

### Features

- add wdi5 as test framework ([e63ce2e](https://github.com/ui5-community/generator-easy-ui5/commit/e63ce2eb2ed9cc23840cb303d01fc4e7d23f2c11))

# [2.3.0](https://github.com/ui5-community/generator-easy-ui5/compare/v2.2.4...v2.3.0) (2020-11-25)

## [2.2.4](https://github.com/ui5-community/generator-easy-ui5/compare/v2.2.3...v2.2.4) (2020-11-10)

## [2.2.3](https://github.com/ui5-community/generator-easy-ui5/compare/v2.2.2...v2.2.3) (2020-11-05)

## [2.2.2](https://github.com/ui5-community/generator-easy-ui5/compare/v2.2.1...v2.2.2) (2020-10-28)

## [2.2.1](https://github.com/ui5-community/generator-easy-ui5/compare/v2.2.0...v2.2.1) (2020-10-23)

# [2.2.0](https://github.com/ui5-community/generator-easy-ui5/compare/v2.1.7...v2.2.0) (2020-10-16)

## [2.1.7](https://github.com/ui5-community/generator-easy-ui5/compare/v2.1.6...v2.1.7) (2020-09-10)

## [2.1.6](https://github.com/ui5-community/generator-easy-ui5/compare/v2.1.5...v2.1.6) (2020-08-24)

## [2.1.5](https://github.com/ui5-community/generator-easy-ui5/compare/v2.1.4...v2.1.5) (2020-08-24)

## [2.1.4](https://github.com/ui5-community/generator-easy-ui5/compare/v2.1.3...v2.1.4) (2020-08-06)

## [2.1.3](https://github.com/ui5-community/generator-easy-ui5/compare/v2.1.2...v2.1.3) (2020-08-03)

## [2.1.2](https://github.com/ui5-community/generator-easy-ui5/compare/v2.1.1...v2.1.2) (2020-06-29)

## [2.1.1](https://github.com/ui5-community/generator-easy-ui5/compare/v2.1.0...v2.1.1) (2020-06-18)

# [2.1.0](https://github.com/ui5-community/generator-easy-ui5/compare/v2.0.1...v2.1.0) (2020-06-15)

## [2.0.1](https://github.com/ui5-community/generator-easy-ui5/compare/v2.0.0...v2.0.1) (2020-06-09)

# [2.0.0](https://github.com/ui5-community/generator-easy-ui5/compare/v1.3.7...v2.0.0) (2020-06-08)

## [1.3.7](https://github.com/ui5-community/generator-easy-ui5/compare/v1.3.6...v1.3.7) (2020-05-06)

## [1.3.6](https://github.com/ui5-community/generator-easy-ui5/compare/v1.3.5...v1.3.6) (2020-05-06)

## [1.3.5](https://github.com/ui5-community/generator-easy-ui5/compare/v1.3.4...v1.3.5) (2020-04-30)

## [1.3.4](https://github.com/ui5-community/generator-easy-ui5/compare/v1.3.3...v1.3.4) (2020-04-29)

## [1.3.3](https://github.com/ui5-community/generator-easy-ui5/compare/v1.3.2...v1.3.3) (2020-04-14)

## [1.3.2](https://github.com/ui5-community/generator-easy-ui5/compare/v1.3.1...v1.3.2) (2020-04-02)

### Bug Fixes

- **app:** Fix lint errors ([c4df165](https://github.com/ui5-community/generator-easy-ui5/commit/c4df165e35b319aedfc932ac37d2593c0fa5e526))
- **formatter:** Fix formatter ([4f637c8](https://github.com/ui5-community/generator-easy-ui5/commit/4f637c81e2a916a0067d36f8d214a447a7a62212))

### Features

- **BaseController:** Adding the BaseController and formatter ([e51a66b](https://github.com/ui5-community/generator-easy-ui5/commit/e51a66bfcd8dea90fd27c7684264e1202bde3e47))
- **BaseController:** Fix lint and activate install again after creation ([8697b1b](https://github.com/ui5-community/generator-easy-ui5/commit/8697b1bdbcc3f82bb8eb5f0e9e750b37f0d44d8f))

## [1.3.1](https://github.com/ui5-community/generator-easy-ui5/compare/v1.3.0...v1.3.1) (2020-03-20)

# [1.3.0](https://github.com/ui5-community/generator-easy-ui5/compare/v1.2.0...v1.3.0) (2020-03-11)

# [1.2.0](https://github.com/ui5-community/generator-easy-ui5/compare/v1.1.1...v1.2.0) (2020-02-13)

## [1.1.1](https://github.com/ui5-community/generator-easy-ui5/compare/v1.0.3...v1.1.1) (2019-12-13)

## [1.0.3](https://github.com/ui5-community/generator-easy-ui5/compare/v1.0.2...v1.0.3) (2019-12-04)

## [1.0.2](https://github.com/ui5-community/generator-easy-ui5/compare/v1.0.1...v1.0.2) (2019-11-08)

## [1.0.1](https://github.com/ui5-community/generator-easy-ui5/compare/v1.0.0...v1.0.1) (2019-11-06)

# [1.0.0](https://github.com/ui5-community/generator-easy-ui5/compare/v0.3.4...v1.0.0) (2019-10-30)

## [0.3.4](https://github.com/ui5-community/generator-easy-ui5/compare/v0.3.3...v0.3.4) (2019-10-24)

## [0.3.3](https://github.com/ui5-community/generator-easy-ui5/compare/v0.3.2...v0.3.3) (2019-10-23)

## [0.3.2](https://github.com/ui5-community/generator-easy-ui5/compare/v0.3.1...v0.3.2) (2019-10-23)

## [0.3.1](https://github.com/ui5-community/generator-easy-ui5/compare/v2.0.2...v0.3.1) (2019-10-23)
