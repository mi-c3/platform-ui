# Conventions

## Code style

- 4-space indent, single quotes, semicolons, max line length 160 — enforced by eslint
  ([config/eslint.js](../config/eslint.js)); `npm run lint:fix` autofixes most of it.
- Plain JavaScript with propTypes (a few files carry legacy `@flow` pragmas; new code does
  not need them). No TypeScript in `src/`.
- Class components use the legacy decorators `@bind` and `@memoize()` from
  `src/utils/decorators/`. New components should be function components with hooks; don't
  add new decorator usage.
- React 19 rule: no `defaultProps` on function components — use default parameters.
- Use the `utils/`, `styles/`, `components/` import aliases inside `src/` instead of long
  relative paths.

## Component patterns

- **Single entry point:** a component is public only if it is exported from
  [`src/index.js`](../src/index.js). Internal helpers (`Loader`, `ModalDialog`,
  `DropzoneSnackBar`-style one-offs) stay unexported.
- **Normalized change events:** form-like components call
  `onChange({ target: { name, value } })` so they drop into Affectli form handling. Keep this
  shape when adding components.
- **Wrap, don't fork:** components extend MUI/third-party components via props passthrough —
  document the props you add/override and pass the rest through.
- **Backwards compatibility:** don't break 1.x consumer APIs; translate legacy props the way
  `src/utils/pickers/pickerProps.js` does, and note the translation in the component doc.

## Testing

- Jest + Testing Library, jsdom environment. Tests live in `test/`, mirroring `src/`
  (`test/components/Button.test.jsx`, `test/utils/utils.test.js`).
- Test files match `*.test.js(x)` / `*.spec.js(x)`.
- New components and prop-translation logic should ship with at least a render + change-event
  test. Coverage is currently thin (2 test files) — add tests when you touch a component.

## Component documentation

Every exported component has a page at `docs/components/<ExportedName>.md`:

```markdown
# <ComponentName>

<1-2 sentences: what it is, what it wraps, link to the underlying lib docs (MUI links must be v7).>

## Import

​```js
import { <ComponentName> } from '@mic3/platform-ui';
​```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
<only the props this wrapper adds/changes; end with a passthrough note when applicable>

## Usage

​```jsx
<minimal realistic example>
​```

## Notes   <!-- optional: quirks, event shapes, legacy prop translations -->
```

Rules:

- Document what the source does, not what it should do. Verify props against the component
  file before editing.
- No site-generator syntax (no Docusaurus frontmatter), no storybook links, no
  v3.material-ui.com links.
- When adding/renaming/removing a component: update its doc, the index in
  [docs/README.md](README.md), and the exports in `src/index.js` together.
