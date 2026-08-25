# platform-ui

A React UI components library based on @material-ui.

## Requirements

* node (> 10.x.x, LTS only)
* yarn (> v1.13.0)

## Build

### Build the UI component library

Run the following commands:

```
yarn
yarn build
```

## Development

### Build the UI component library

To re-build the UI component library after every change in the source file run the following commands:

```
yarn
yarn build:watch
```

### Link this module in another project without publish it

#### Install the module

Add the following dependency in the package.json:

```
"platform-ui": "link:../platform-ui"
```

Where `../platform-ui` is the path to the root folder of this project.

## Install (as a consumer)

From **1.9.0 onwards the 1.x line is published to the internal GitLab package registry**, not
to public npmjs.org — npmjs.org carries only the frozen `<=1.8.9` releases, and we can no
longer push the 1.x line there. The 2.x line on `master` uses the same registry.

Add to the consuming project's `.npmrc` (commit the file — scope mapping only, **no auth
token**, since a committed `_authToken` overrides `~/.npmrc` and breaks local installs):

```
@mic3:registry=https://gitlab.mi-c3.com/api/v4/projects/261/packages/npm/
```

Auth is required but must never be committed: locally put the token in your user-level
`~/.npmrc`; in consumer CI append it at runtime (see the `.npm-auth` template in
platform-v1's `.gitlab-ci.yml`). Then install a 1.x version **explicitly**:

```
npm install @mic3/platform-ui@^1.9.0
```

Do **not** run a bare `npm install @mic3/platform-ui` if you want the 1.x line: `latest` on this
registry points at the current 2.x release. The 1.x line is published under the `legacy`
dist-tag, so `npm install @mic3/platform-ui@legacy` also resolves the newest 1.x.

## Releasing

Bump `version` in `package.json`, then push a matching `vX.Y.Z` tag. The `publish` job in
`.gitlab-ci.yml` runs only on those tags, guards that the tag matches `package.json`, and
publishes to this project's GitLab registry using `CI_JOB_TOKEN`. The `prepack` script
rebuilds `build/` so the tarball can never ship a stale bundle.

Releases from this line publish under the **`legacy`** dist-tag via an explicit
`npm publish --tag legacy` in the job, so they never move `latest` away from the 2.x release.

If you ever publish this line **by hand, you must pass `--tag legacy` yourself** — a bare
`npm publish` would drag `latest` back to 1.x. `publishConfig.tag` looks like it would prevent
this but is silently ignored by npm 10, so it is deliberately not used here.

Publishing to npmjs.org is no longer part of the release path.
