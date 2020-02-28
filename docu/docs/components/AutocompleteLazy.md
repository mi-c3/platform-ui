---
id: autocompleteLazy
title: AutocompleteLazy
---

## Notes

Component `AutocompleteLazy` same as [Autocomplete](/docs/components/autocomplete) but with one extra function `fetchData`, which can fetch options and pass it to Autocomplete.

## How to use

### fetchData(searchText: string) => array

#### args

Name       |  Type  | Description
---------- | :----: | ---------------------------
searchText | string | value for filtering results

#### example

```javascript
const fetchData = async (searchText = null) => {
    let users = store;
    if (searchText) {
        users = store.filter(
            ({ id, login, name }) =>
                String(id) === searchText ||
                login.toLowerCase().includes(searchText.toLowerCase()) ||
                name.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    return users;
};
```

## Storybook

<[Autocomplete/Typeahead](/platform-ui/redirect?/storybook/index.html?path=/story/components-autocomplete--typeahead)>
