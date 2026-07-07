# Getting started

## Requirements

- node >= 22.11.0 < 23
- npm (the repo ships a `package-lock.json`; yarn is not used anymore)

## Install (as a consumer)

`@mic3/platform-ui` declares every UI framework package as a peer dependency — the consuming
application provides react, MUI, emotion, styled-components, and the rest:

```shell
npm install @mic3/platform-ui \
  react react-dom prop-types moment \
  @mui/material @mui/icons-material @mui/x-date-pickers \
  @emotion/react @emotion/styled styled-components \
  react-router-dom react-dropzone react-color react-mde \
  react-tiny-virtual-list google-map-react memoize-one fast-deep-equal
```

Supported peer ranges: react 17–19, @mui/material v7, styled-components 5–6,
react-router-dom 5–6. See `peerDependencies` in [package.json](../package.json) for the
authoritative list.

## Develop (in this repo)

```shell
npm install
npm run build          # one-off ES module build to build/index.js
npm run build:watch    # rebuild on every source change
npm test               # jest (jsdom)
npm run lint           # eslint
npm run lint:fix
```

`npm install` currently needs `legacy-peer-deps` (set in [.npmrc](../.npmrc)) because some
peers (react-mde, react-tiny-virtual-list) still declare pre-React-19 ranges. Remove that
flag once those peers are modernized.

## Link into an application without publishing

In the consuming app (e.g. platform-v1):

```shell
npm install ../platform-ui
```

npm installs a `file:` directory dependency as a symlink. The app's bundler config must alias
react/@mui/@emotion/styled-components to the app's own `node_modules` so the symlinked library
cannot load a second copy of the singletons (platform-v1's `rspack.config.js` already does).
Rebuild this library (`npm run build` or `npm run build:watch`) for changes to reach the app.

Before merging app work that depends on unpublished changes here, publish the new version and
switch the app's `package.json` from `file:../platform-ui` back to the published version.

## Publish

Only the `build/` directory is published (`files` in package.json). `prepack` runs the build
automatically, so a plain `npm publish` produces a complete package. Bump `version` first;
CI (`.gitlab-ci.yml`) also packs a build tarball per branch/tag for internal artifacts.
