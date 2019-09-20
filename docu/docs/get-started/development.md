---
id: development
title: Development
---

# Build the UI component library

To re-build the UI component library after every change in the source file run the following commands:

```
yarn
yarn build:watch
```

# Show the storybook

Run the following commands:

```shell
yarn
yarn start
```

# How to use this module in another project

## Development (Live reload)

To live reload the @mic3/platform-ui module, clone the project at the same level of your project root folder and change the dependency in the package.json as following:

```json
// where `../platform-ui` path to the platform-ui directory.
"@mic3/platform-ui": "link:../platform-ui"
```

And use yarn or npm to install it:

```shell
yarn
## or
npm install
```

N.B. Do not commit the changes!
