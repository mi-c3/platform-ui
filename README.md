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
