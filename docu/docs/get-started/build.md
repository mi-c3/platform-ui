---
id: build
title: Build
---

# Build the UI component library

Run the following commands:

```shell
yarn
yarn build
```

# Build the static storybook site (HTML+JS+CSS)

Run the following commands:

```shell
yarn
yarn storybook:build
```

To test the build you can use:

```shell
cd storybook-static
npx http-server -p 8088
```

Open <http://localhost:8088> in the browser.
