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

## Install into an application without publishing

Build this library and install it in the consuming app as a real copy, with `--install-links`:

```shell
# in the consuming app (platform-v1 has this as `npm run ui:local`)
npm run build --prefix ../platform-ui \
  && rm -rf node_modules/@mic3/platform-ui \
  && npm i ../platform-ui --install-links --no-save
```

Each part matters: `--install-links` copies the package instead of symlinking it and installs only
its own `dependencies`; `--no-save` leaves the app's `package.json`/lockfile untouched (a plain
`npm i` restores the released version); the `rm -rf` is required because the version here does not
change between local builds, so npm reports "up to date" and keeps the previous copy. The explicit
build is required too — `--install-links` does not run `prepack`.

Rebuilding here does not reach the app on its own: re-run that line, then restart the app's dev
server (a watch rebuild does not re-read a swapped `node_modules` package) and hard-reload the tab.

**Do not use `npm link`, and do not `npm install ../platform-ui` without `--install-links`.** Both
give the app a symlink, and a symlinked package resolves its imports from its real path — straight
into the peer dependencies this repo installs for its own tests. Singletons the app aliases to its
own copies (react, react-dom, styled-components, @mui/\*, @emotion/\*) survive that; **react-router
does not**, because it is ESM-only with an `exports` map and no `main`, so it cannot be aliased to a
directory. The app loads two copies, the router context resolves to `null`, and everything under a
`<Route>` dies with `Cannot read properties of null (reading 'basename')`.

That whole failure mode exists for one component: [`Link`](../src/components/Link.js) renders
`MuiLink` with `component={RouterLink}` when it is given a `to`, and that single import is why
`react-router` is a peer dependency at all. Injecting the router link from the consuming app instead
would drop the peer entirely and make plain `npm link` safe — at the cost of a breaking change to
`Link`'s contract, so it has not been done.

Before merging app work that depends on unpublished changes here, release the new version
(see [releasing.md](releasing.md)) and bump the app's dependency to it.

## Publish

Releases are published by CI to the internal GitLab package registry when a `vX.Y.Z` tag is
pushed — never to public npmjs.org (the 1.x line there is frozen). Only `build/` is shipped;
`prepack` rebuilds it during publish. Full flow, tag rules, and safeguards:
[releasing.md](releasing.md).
