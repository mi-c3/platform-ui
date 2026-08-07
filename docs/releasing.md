# Releasing

## Where releases go

- **2.x** is published to the **internal GitLab package registry** — the project-level npm
  registry of this repository on gitlab.mi-c3.com (project ID `261`,
  `affectli-project/platform-ui`). It is **never** published to public npmjs.org.
- **1.x on public npmjs.org is frozen** (latest `1.8.9`). Legacy client deployments still
  consume it from there — do not publish anything to the public registry.

Two independent safeguards enforce this:

1. `publishConfig` in [package.json](../package.json) hardcodes the GitLab project registry
   URL and `access: restricted`, so a stray `npm publish` from a dev machine targets GitLab
   (and fails without credentials) instead of reaching npmjs.org.
2. The CI publish job authenticates with the pipeline's `CI_JOB_TOKEN` only — no npm.org
   credentials exist anywhere in the pipeline.

## What gets published

Only `build/` plus package.json, README.md, and LICENSE (`files` in package.json; npm adds
the last two automatically). `prepack` runs the rspack build, so `npm publish` always ships a
fresh bundle. Peer dependencies are never bundled (see [architecture.md](architecture.md)).

Sanity-check the contents locally with `npm pack --dry-run` — expect exactly package.json,
README.md, LICENSE, and `build/index.js` / `index.css` with their source maps.

## Release flow

1. On a feature branch, bump `version` in package.json (semver, 2.x line) and add the entry
   for it to [CHANGELOG.md](../CHANGELOG.md) — that entry is the tag's release notes, and it
   is where a breaking change shipped under a non-major bump has to be called out.
2. Open an MR to `master`; note that branch pipelines do not run on feature branches or
   `master`, so run the gates locally before merging:

   ```shell
   npm ci
   npm run build && npm run lint && npm test
   npm audit --omit=dev --audit-level=high
   npm pack --dry-run
   ```

3. After the merge, tag the merged commit `vX.Y.Z` — the tag **must** be the package.json
   version prefixed with `v` (the publish job verifies this and fails otherwise):

   ```shell
   git tag v2.0.0 <merged-sha>
   git push origin v2.0.0
   ```

4. The tag pipeline runs build → verify (audit, lint, test) → pack → store → **publish**.
   The publish job appends the registry and job-token lines to `.npmrc` (appending keeps the
   committed `legacy-peer-deps=true` intact for `npm ci`) and runs `npm publish`.
5. Verify the package appears under the project's **Deploy → Package Registry** in GitLab.

## Rules

- **Never republish an existing version.** The registry rejects duplicates; if a release is
  bad, bump the patch version and tag again.
- **Once a version has been published, never delete and re-push its tag** — consumers cache
  by `(name, version, integrity)`. A tag whose pipeline failed *before* the publish job ran
  may be deleted and recreated (e.g. after a CI fix), since nothing was released under it.
- Tags must be `vX.Y.Z` exactly. Bare `2.0.0`-style tags (used historically) still run the
  normal tag pipeline but are skipped by the publish job.
- A failed publish burns that version — fix the problem, bump the patch, retag.
- **Re-QA the date/time pickers whenever `@mui/x-date-pickers` is bumped.** `DatePicker`,
  `TimePicker`, `DateTimePicker` and the `DateTimePickerRange` modal reproduce the v3 modal on top
  of MUI X behaviour that is not part of its public contract: the two-step view grouping the
  pickers advance across themselves, the picker context hooks the action bar and field slots read
  (`usePickerActionsContext`, `usePickerContext`), and `.MuiPickersLayout-*` classes for the toolbar
  and tab background. The jsdom tests cover the commit point and the field, but not the clock (MUI
  derives its selection from pointer geometry) and not appearance, so check by hand: open each
  picker, pick a day and an hour, press OK, press Cancel, and press OK with nothing selected. See
  the Behaviour section in [components/DatePicker.md](components/DatePicker.md).

## Consumer registry configuration

Consuming projects map the `@mic3` scope to the **project-level** registry URL in a committed
`.npmrc` — scope mapping only, no auth token. The registry rejects anonymous pulls (401);
auth comes from the developer's `~/.npmrc` locally and from a `before_script` appending
`_authToken=${CI_JOB_TOKEN}` in the consumer's CI (a committed token line would override
`~/.npmrc` and break local installs). See "Install (as a consumer)" in
[getting-started.md](getting-started.md). Do not use the instance-level GitLab URL
(`/api/v4/packages/npm/`): it silently redirects (303) to public npmjs.org, which only has
the frozen 1.x line.
