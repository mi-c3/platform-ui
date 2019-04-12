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

### Build the static storybook site (HTML+JS+CSS)

Run the following commands:

```
yarn
yarn storybook:build
```

To test the build you can use:

```
cd storybook-static
npx http-server -p 8088
```

Open http://localhost:8088 in the browser.

## Development

### Build the UI component library

To re-build the UI component library after every change in the source file run the following commands:

```
yarn
yarn build:watch
```

### Show the storybook

Run the following commands:

```
yarn
yarn start
```

### How to use this module in another project

#### Install the module

Add the following dependency in the package.json:

```
"@mic3/platform-ui": "git+ssh://git@github.com:mi-c3/platform-ui.git"
```

And use yarn or npm to install it:

```
yarn
# or
npm install
```

#### Upgrade the yarn.lock to use the last version

Execute:

```
yarn upgrade @mic3/platform-ui
```

#### Development (Live reload)

To live reload the @mic3/platform-ui module, clone the project at the same level of your project root folder and change the dependency in the package.json as following:

```
  "@mic3/platform-ui": "link:../platform-ui"
```

and install the module using:

```
yarn
# or
npm install
```

N.B. Do not commit the changes!
