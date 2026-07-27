# CLAUDE.md

React UI component library (`@mic3/platform-ui`): wrappers around MUI v7 plus a passthrough
re-export of MUI core, bundled as one ES module. npm only (no yarn). Consumers need node
>= 22.11 < 23 (`engines`); developing in this repo needs node 22.22.1 (`.nvmrc`, CI image) —
the react-router 8 devDependency sets that floor, the published bundle does not.

## Commands

```shell
npm install            # needs .npmrc legacy-peer-deps (react-mde/react-tiny-virtual-list peers)
npm run build          # rspack -> build/index.js (ES module)
npm run build:watch
npm test               # jest, jsdom
npx jest test/components/Button.test.jsx   # single test file
npm run lint           # eslint (also runs inside the rspack build)
npm run lint:fix
```

## Structure

- `src/index.js` — the ONLY public entry point. A component is public iff exported here.
- `src/components/` — custom components; `Location/`, `Table/`, `Upload/` group related ones.
  `Loader.js` and `ModalDialog.js` are internal (not exported).
- `src/utils/`, `src/styles/` — helpers and theming; import via aliases `utils/...`,
  `styles/...`, `components/...` (rooted at `src/`, see jsconfig.json / config/babel.js).
- `config/babel.js` — single shared babel config (rspack + jest + eslint parser).
- `config/eslint.js` — eslint config factory; `.eslintrc.js` and eslint-rspack-plugin both use it.
- `docs/` — markdown docs: README (index), getting-started, architecture, conventions,
  `components/<ExportedName>.md` per exported component.
- `build/` — generated, gitignored; the only thing published (`files: ["build"]`) — to the
  internal GitLab package registry, never public npm (see docs/releasing.md).

## Hard constraints

- All UI framework packages (react, @mui/*, @emotion/*, styled-components, moment, ...) are
  **peerDependencies and rspack externals** — never bundle them, never add one as a regular
  dependency. Regular `dependencies` are only small runtime libs (dompurify is bundled;
  marked and react-avatar-editor are deps but still externals).
- Supported ranges: react 18–19, @mui/material 7, styled-components 5–6, react-router 7–8.
  The react floor is 18 because react-router 7 peers `react >=18` — MUI 7 alone would allow 17.
- Don't break 1.x consumer APIs. Legacy props are translated, not removed — pattern:
  `src/utils/pickers/pickerProps.js` (v3 picker props like `inputVariant`, `clearable`,
  string date values).
- React 19: no `defaultProps` on function components — use default parameters.
- Form-like components emit `onChange({ target: { name, value } })`. Keep this event shape.
- Class components use legacy decorators (`@bind`, `@memoize()`); babel is configured for
  them, but write NEW components as function components without decorators.
- Style: 4-space indent, single quotes, semicolons, max-len 160 (eslint enforces).

## When changing components

Update together: `src/index.js` exports ↔ `docs/components/<Name>.md` ↔ component index in
`docs/README.md`. Doc format/template: `docs/conventions.md`. Document actual source behavior;
verify props against the component file. Add/extend a test in `test/` mirroring `src/`.

## Gotchas

- `npm run build` fails on eslint errors (eslint-rspack-plugin runs in the build).
- `.npmrc` `legacy-peer-deps=true` is temporary (remove when react-mde /
  react-tiny-virtual-list peers modernize).
- CI (`.gitlab-ci.yml`) runs only on `development`, `qa`, tags, and `v*x` branches; a `vX.Y.Z`
  tag additionally publishes to the internal GitLab package registry (public npmjs.org stays
  frozen at 1.x).
