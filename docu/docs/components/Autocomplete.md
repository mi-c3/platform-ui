---
id: autocomplete
title: Autocomplete
---

## Notes

Component `Autocomplete` based on Material UI `TextField`. All other properties you can see in [official documentation](https://v3.material-ui.com/api/text-field/)

## Extra Props

Name             |   Type   | Default            | Description
---------------- | :------: | ------------------ | --------------------------------------------------------------------------------------
clearable        |   bool   | true               | adding clear icon to the end of input field
options          |  array   | []                 | suggestions when you typeahead in input
optionTemplate   | function | null               | helper function for rendering **option**, **label**, **startAdornment**, **ChipProps**
suggest          | function | null               | function invoked when process search queries
valueField       |  string  | null               | field of a suggested object to resolve and display
VirtualListProps |  object  | `{ itemSize: 50 }` | props for `react-tiny-virtual-list` library
PopperProps      |  object  | {}                 | props for Popper component

## How to use

### optionTemplate(option: object) => object

#### args

Name   |  Type  | Description
------ | :----: | ------------------------
option | object | option from options list

#### example

```javascript
class MdiSelectIconClass extends MdiIconSelect {
    optionTemplate = ({ value, label, image }) => ({
        // properties for ChipProps when multiple=true
        ChipProps: {
            icon: <MdiIcon name={value} size={19} />,
            // OR (don't use both for chips)
            avatar: <Avatar initials={value} src={image} className={this.props.classes.avatar} />,
        },
        // template for startAdornment
        startAdornment: <MdiIcon name={value} size={19} />,
        // template for selected value
        label,
        // template for rendering item option
        option: (
            <ListItem ContainerComponent="div" dense disableGutters>
                <ListItemIcon>
                    <MdiIcon name={value} />
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItem>
        ),
    });
}
```

### suggest(event: Event) => void

#### example

```javascript

@bind
async suggest(event) {
    const { value } = event.target;
    const options = await this.props.fetchData(value);
    this.setState({ options });
}
```

## Storybook

<[Autocomplete/Dropdown](/redirect?/storybook/index.html?path=/story/components-autocomplete--dropdown)>
