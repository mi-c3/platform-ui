# AutocompleteLazy

The same component as [Autocomplete](./Autocomplete.md), but the options are loaded asynchronously through a `fetchData` function instead of being passed in as a static `options` array.

## Import

```js
import { AutocompleteLazy } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `fetchData` | func (required) | — | `async (searchText) => options`. Called with the current query when the user types (and with no argument when the query equals the selected value's label). The resolved array becomes the suggestion list. |

All other props are the same as `Autocomplete` and are passed straight through to it (`onChange`, `value`, `valueField`, `multiple`, `optionTemplate`, ...). The `suggest` and `options` props are managed internally and should not be supplied.

## Usage

```jsx
const fetchUsers = async (searchText) => {
    const users = await api.searchUsers(searchText || '');
    return users.map((u) => ({ label: u.name, value: u.id }));
};

<AutocompleteLazy
    label="Assignee"
    name="assignee"
    fetchData={fetchUsers}
    valueField="value"
    value={assignee}
    onChange={(e) => setAssignee(e.target.value)}
/>
```

## Notes

- Options are not pre-loaded on mount (intentionally, to avoid slow page loads when many instances render at once); the first `fetchData` call happens when the user interacts with the field.
