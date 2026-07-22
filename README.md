# platform-ui

A React UI components library based on [MUI](https://mui.com) (`@mui/material` v7, emotion engine).

Version 2.x targets React 17–19, MUI v7, styled-components 5–6, and builds as an ES module
(`build/index.js`). All UI framework packages (react, @mui/*, @emotion/*, styled-components,
react-router-dom, ...) are `peerDependencies` — the consuming application provides them.

Documentation lives in [docs/](docs/README.md) — getting started, architecture, conventions,
and one page per component under [docs/components/](docs/components/). AI agents: see
[CLAUDE.md](CLAUDE.md).

## Install (as a consumer)

2.x is published to the **internal GitLab package registry** — not to public npmjs.org (which
hosts only the frozen 1.x line). Add to the consuming project's `.npmrc` (commit the file —
scope mapping only, **no auth token**):

```
@mic3:registry=https://gitlab.mi-c3.com/api/v4/projects/261/packages/npm/
```

Auth is required but must never be committed — locally it goes in your user-level
`~/.npmrc`, in consumer CI it is appended at runtime. Full setup (token scopes, CI
snippet, job token allowlist, why a committed token breaks local installs):
["Install (as a consumer)" in docs/getting-started.md](docs/getting-started.md#install-as-a-consumer).

Then:

```
npm install @mic3/platform-ui
```

All UI framework packages are peer dependencies the consuming app must provide — full list
and details in [docs/getting-started.md](docs/getting-started.md).

## Requirements (developing this repo)

* node >= 22.11.0 < 23
* npm (the repo ships a `package-lock.json`)

## Build

```
npm install
npm run build
```

## Development

Rebuild on every source change:

```
npm run build:watch
```

## Test / Lint

```
npm test
npm run lint
```

## Link this module into platform-v1 without publishing

In platform-v1:

```
npm install ../platform-ui
```

npm installs a `file:` directory dependency as a symlink. platform-v1's `rspack.config.js`
carries `resolve.alias` entries that pin react/@mui/@emotion/styled-components to the app's
own `node_modules`, so the symlinked library can never load a second copy of the singletons.
Rebuild this library (`npm run build` or `build:watch`) for changes to reach the app.

Before merging platform-v1 work that depends on unpublished changes here, release the new
version (tag `vX.Y.Z` → CI publishes to the internal GitLab package registry, see
[docs/releasing.md](docs/releasing.md)) and switch platform-v1's `package.json` from
`file:../platform-ui` to it.

## v2 migration notes (from 1.x)

* `@material-ui/*` v4 is gone; passthrough re-exports come from `@mui/material` v7.
* Compat aliases kept: `ExpansionPanel*` → `Accordion*`, `GridList*` → `ImageList*`,
  `Grid` → MUI v7 `GridLegacy` (the classic `item`/`xs` API), `MuiPickersUtilsProvider` →
  a shim over `LocalizationProvider` (moment adapter, `utils` prop ignored).
* Removed (no consumers existed): `RootRef`, `Hidden`, `withWidth`, `withMobileDialog`,
  `createGenerateClassName`.
* `DatePicker`/`TimePicker`/`DateTimePicker` wrap `@mui/x-date-pickers` v8 but keep the
  legacy v3 wrapper props (`inputVariant`, `clearable`, `showTodayButton`,
  `TextFieldComponent`, string values) — see `src/utils/pickers/pickerProps.js`.
* `Dropzone`/`Upload*` run on react-dropzone 14; a string `accept` prop is still supported.
* React 19: no `defaultProps` on function components — use default parameters.
