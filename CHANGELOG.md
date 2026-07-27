# Changelog

Notable changes per released version. Use these entries as the GitLab tag release notes.

## 2.1.0

### Breaking (peer dependency), despite the minor bump

`react-router-dom` is replaced by `react-router`. `Link` is the only component that imports a
router directly, and it now takes its `RouterLink` from `react-router`:

```diff
-import { Link as RouterLink } from 'react-router-dom';
+import { Link as RouterLink } from 'react-router';
```

Two peer ranges narrow as a result:

| Peer | Before | After |
|------|--------|-------|
| router | `"react-router-dom": ">=5.1.2 <7"` | `"react-router": ">=7 <9"` |
| react / react-dom | `">=17.0.0 <20"` | `">=18.0.0 <20"` |

**Consumers on react-router v5 or v6 are no longer supported.** Those versions do not export
`Link` from `react-router` — the DOM components only existed in `react-router-dom` — so
`<Link to="...">` fails to resolve. `<Button to="...">` is affected too — it renders through
the same `Link`. Upgrade the application to react-router 7 or 8 before taking this release.

**Consumers on react 17 are no longer supported.** react-router 7 peers `react >=18` (8 peers
`>=19.2.7`), so a react-17 app cannot satisfy the new router peer at all. MUI 7 on its own
would still allow react 17; the router is what sets the floor. Staying on react 17 means
staying on 2.0.0.

Why the router swap at all: react-router 8 deleted the `react-router-dom` package outright, and
pinning `react-router-dom@7.18.1` (its final release) drags in exactly `react-router@7.18.1`,
which is covered by [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2)
(high, no patched 7.x exists).

### Not changed

- **`engines.node` stays `>=22.11.0 <23`.** react-router 8 declares `engines.node >=22.22.0`,
  but that binds this repo's toolchain, not consumers of the published bundle — which is
  browser ESM and runs no node code. Consumers who choose react-router 8 get that constraint
  from react-router itself; consumers on react-router 7 (`>=20.0.0`) should not inherit it.
  The dev floor lives in `.nvmrc` and the `.gitlab-ci.yml` image instead, both at 22.22.1.
- react-router stays an rspack external — the consuming app still owns the router instance.
