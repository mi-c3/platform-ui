# Architecture

## What this library is

A single-entry React component library. [`src/index.js`](../src/index.js) is the only public
entry point and exports three kinds of things:

1. **Custom components** — wrappers/extensions in [`src/components/`](../src/components/)
   (see [components/](components/) for per-component docs). Most add a normalized change event
   (`{ target: { name, value } }`), extra props, or Affectli-specific behavior on top of MUI
   or a third-party library.
2. **MUI passthrough re-exports** — most of `@mui/material` v7 re-exported as-is
   (`Dialog`, `Paper`, `Typography`, …) so applications import everything from one package.
3. **Compat aliases** — kept so v1-era application code keeps compiling:
   - `ExpansionPanel*` → `Accordion*`
   - `GridList*` → `ImageList*`
   - `Grid` → MUI v7 `GridLegacy` (classic `item`/`xs` API)
   - `MuiPickersUtilsProvider` → shim over `LocalizationProvider` (moment adapter; the v3
     `utils` prop is accepted and ignored)

## Directory layout

```
src/
  index.js            public entry point — every export lives here
  components/         custom components (one file per component; Location/, Table/, Upload/ group related ones)
  styles/             theme (theme.js, DarkTheme), color palettes, mapTheme, react-mde css
  utils/              shared helpers (pickers/, maps/, hoc/, decorators/, lo/, …)
test/                 jest tests, mirroring src/ layout
config/
  babel.js            shared babel config (rspack, jest, eslint parser)
  eslint.js           eslint config factory (rspack build vs full CLI lint)
  jest/               style/file mocks for jest moduleNameMapper
docs/                 this documentation
build/                (generated, gitignored) ES module bundle — the published artifact
```

Imports inside `src/` may use the aliases `utils/...`, `styles/...`, `components/...`
(rooted at `src/`). They are resolved by `babel-plugin-module-resolver` (build/test) and
declared for editors in [jsconfig.json](../jsconfig.json).

## Build pipeline

- **Bundler:** rspack ([rspack.config.js](../rspack.config.js)), entry `src/index.js`,
  output `build/index.js` as an ES module (`experiments.outputModule`).
- **Externals:** everything the consumer provides (all peer dependencies) plus `marked` and
  `react-avatar-editor` is left external by prefix match — deep imports like
  `@mui/material/Button` stay external too. Only small runtime deps (e.g. `dompurify`) are
  bundled.
- **Transforms:** babel ([config/babel.js](../config/babel.js)) — preset-react (automatic
  runtime), preset-env targeting Chrome 115, legacy decorators (`@bind`, `@memoize` in class
  components), class properties, styled-components plugin.
- **CSS:** rspack's native CSS support (`experiments.css`) handles the one CSS import
  (`styles/react-mde-all.css` used by TextEditor).
- **Lint/test:** eslint 8 via [config/eslint.js](../config/eslint.js) (also run inside the
  rspack build via eslint-rspack-plugin); jest 29 with jsdom
  ([jest.config.js](../jest.config.js)).

## Versioning and compatibility

The 2.x line targets MUI v7 / React 18–19 / styled-components 5–6. Legacy component APIs from
the 1.x line (v3-era picker props such as `inputVariant`, `clearable`, string date values) are
translated in [`src/utils/pickers/pickerProps.js`](../src/utils/pickers/pickerProps.js) rather
than broken — the design rule is: **consumers of the old API keep working; new code should use
the current MUI idioms.**

## CI

[.gitlab-ci.yml](../.gitlab-ci.yml): build → verify (audit, lint, test) → pack (tarball of
`build/`) → store (copy to internal artifacts dir) → publish. Runs on `development`, `qa`,
tags, and `v*x` maintenance branches. The publish stage runs only on `vX.Y.Z` tags: it
verifies the tag matches package.json's version, appends the project registry + job-token
lines to `.npmrc` (preserving `legacy-peer-deps`), and `npm publish`es to this project's
GitLab package registry (see [releasing.md](releasing.md)).
