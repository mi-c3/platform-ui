# Getting started

## Requirements

- node >= 22.11.0 < 23 to consume the package (`engines` in package.json); node 22.22.1 to
  develop in this repo — see [Develop (in this repo)](#develop-in-this-repo)
- npm (the repo ships a `package-lock.json`; yarn is not used anymore)

## Install (as a consumer)

2.x is published to the internal GitLab package registry, not to public npmjs.org (which
hosts only the frozen 1.x line). Map the `@mic3` scope in the consuming project's `.npmrc`
(commit the file — scope mapping only, **no auth token**):

```
@mic3:registry=https://gitlab.mi-c3.com/api/v4/projects/261/packages/npm/
```

`261` is this repository's GitLab project ID. Use the **project-level** URL exactly as shown —
the instance-level URL (`/api/v4/packages/npm/`) silently redirects (303) to public npmjs.org.

The registry does **not** allow anonymous pulls (requests without a token get 401), so auth
is required — but never commit an `_authToken` line in the project `.npmrc`: npm's config
precedence (project > user) means it overrides every developer's `~/.npmrc` and breaks local
installs (locally `${CI_JOB_TOKEN}` is unset, so npm sends an empty token). Configure auth
per environment instead:

- **Local installs**: add to your user-level `~/.npmrc`, using a GitLab token with
  `read_api` / `read_package_registry` access to this project:

  ```
  //gitlab.mi-c3.com/api/v4/projects/261/packages/npm/:_authToken=<your-gitlab-token>
  ```

- **Consumer CI**: append the auth line at runtime in `before_script` on jobs that run
  `npm ci`/`npm install` — GitLab injects `CI_JOB_TOKEN` automatically:

  ```yaml
  before_script:
    - echo "//gitlab.mi-c3.com/api/v4/projects/261/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
  ```

  (platform-v1 does this via its `.npm-auth` template in `.gitlab-ci.yml`.) The consuming
  project must also be on **this repository's job token allowlist** (Settings → CI/CD →
  Job token permissions on project 261) — a missing entry fails the pull with `403 Forbidden`
  even though the token is valid.

`@mic3/platform-ui` declares every UI framework package as a peer dependency — the consuming
application provides react, MUI, emotion, styled-components, and the rest:

```shell
npm install @mic3/platform-ui \
  react react-dom prop-types moment \
  @mui/material @mui/icons-material @mui/x-date-pickers \
  @emotion/react @emotion/styled styled-components \
  react-router react-dropzone react-color react-mde \
  react-tiny-virtual-list google-map-react memoize-one fast-deep-equal
```

Supported peer ranges: react 18–19, @mui/material v7, styled-components 5–6,
react-router 7–8. See `peerDependencies` in [package.json](../package.json) for the
authoritative list.

## Develop (in this repo)

Use the node version in [.nvmrc](../.nvmrc) (22.22.1, the same image CI runs). That floor comes
from the react-router 8 devDependency, which declares `engines.node >= 22.22.0`; consumers of
the published package only need the wider `engines` range in package.json.

```shell
nvm use
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

Before merging app work that depends on unpublished changes here, release the new version
(see [releasing.md](releasing.md)) and switch the app's `package.json` from
`file:../platform-ui` back to the published version.

## Publish

Releases are published by CI to the internal GitLab package registry when a `vX.Y.Z` tag is
pushed — never to public npmjs.org (the 1.x line there is frozen). Only `build/` is shipped;
`prepack` rebuilds it during publish. Full flow, tag rules, and safeguards:
[releasing.md](releasing.md).
