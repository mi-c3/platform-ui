# DataTable

A data table with client-side sorting, pagination, and row selection, composed from the MUI [Table](https://mui.com/material-ui/api/table/), [TablePagination](https://mui.com/material-ui/api/table-pagination/), and [Toolbar](https://mui.com/material-ui/api/toolbar/) components (wrapped in a `Paper`). Rendering is plain — all rows of the current page are rendered; there is no virtualization.

## Import

```js
import { DataTable } from '@mic3/platform-ui';
```

## Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| columnDefinitions | array | - | **Required.** Column definitions; see shape below. |
| data | array | - | **Required.** Row objects. Values are looked up with `row[column.field]`. |
| dataKey | string | - | Name of the row property used as the row key and as the selection id; falls back to `row.id` when unset. |
| title | string | - | Table title shown in the toolbar (when nothing is selected). |
| gridSettings | object | - | Initial grid state: `{ sort: [{ field, order }], pageSize }`. `sort[0]` seeds the initial sort column/direction, `pageSize` the rows per page (defaults to `10` when omitted). |
| selectionMode | string | - | `'single'` or `'multiple'`. When unset, clicking a row does nothing. |
| onSelectionChange | func | `() => {}` | Called with the array of selected ids whenever the selection changes (row click or toolbar select-all). |

Props are not passed through to the underlying MUI `Table`.

### Column definition shape

```js
{
    field: 'name',                        // key into the row object (also the sort field)
    header: 'Name',                       // header label; falls back to `field` if omitted
    sortable: true,                       // set to false to disable the sort control for this column
    renderValue: ({ value }) => <b>{value}</b>, // optional custom cell renderer
}
```

## Usage

```jsx
<DataTable
    title="Users"
    dataKey="id"
    columnDefinitions={[
        { field: 'name', header: 'Name' },
        { field: 'email', header: 'Email', sortable: false },
        { field: 'active', header: 'Active', renderValue: ({ value }) => (value ? 'Yes' : 'No') },
    ]}
    data={users}
    gridSettings={{ pageSize: 10, sort: [{ field: 'name', order: 'asc' }] }}
    selectionMode="multiple"
    onSelectionChange={(selected) => console.log(selected)}
/>
```

## Notes

- Sorting and pagination are entirely client-side (`stableSort` over `data`, then a page slice). Clicking a sortable header toggles between `desc` and `asc`.
- `gridSettings.pageSize` defaults to `10` when omitted. Rows-per-page options are fixed to `[5, 10, 25]`.
- `gridSettings` is only read in the constructor; changing it later does not update the table.
- Row selection and the toolbar "Select All" checkbox (shown only for `selectionMode="multiple"`) both use `row[dataKey]` as the id (falling back to `row.id` when `dataKey` is unset), and both fire `onSelectionChange`.
- Besides the title (or selected count), the toolbar only contains the select-all checkbox in `multiple` mode; there are no other toolbar actions.
- `onSelectionChange` receives the full selected-id array, e.g. `['a', 'c']`.
