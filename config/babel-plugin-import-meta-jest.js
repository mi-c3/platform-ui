const { pathToFileURL } = require('url');

/**
 * Jest-only babel plugin: replace `import.meta` with a plain object.
 *
 * react-router 8 is published ESM-only and its SSR modules reference
 * `import.meta.hot` (HMR guard). Jest runs modules as CommonJS, and
 * @babel/preset-env's commonjs transform leaves `import.meta` untouched — node's
 * vm then throws `SyntaxError: Cannot use 'import.meta' outside a module`.
 *
 * Substituting an object makes `import.meta.hot` / `import.meta.env.X` evaluate
 * to `undefined`, which is the correct answer under Jest (no HMR, no Vite env).
 * Wired only in jest.config.js, so the rspack build keeps real ESM semantics.
 */
module.exports = function importMetaToObject({ types: t }) {
    return {
        name: 'import-meta-to-object-jest',
        visitor: {
            MetaProperty(path, state) {
                const { meta, property } = path.node;
                if (meta.name !== 'import' || property.name !== 'meta') {
                    return;
                }
                const filename = state.file.opts.filename;
                path.replaceWith(
                    t.objectExpression([
                        t.objectProperty(
                            t.identifier('url'),
                            t.stringLiteral(filename ? pathToFileURL(filename).href : ''),
                        ),
                        t.objectProperty(t.identifier('env'), t.objectExpression([])),
                    ]),
                );
            },
        },
    };
};
