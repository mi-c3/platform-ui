import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { DataTable } from '../../src';

const columnDefinitions = [{ field: 'name', header: 'Name' }];
const makeData = (count) =>
    Array.from({ length: count }, (_, i) => ({ uid: `u${i}`, id: `id${i}`, name: `Row ${i}` }));

test('renders the first page with a default page size when gridSettings is omitted', () => {
    render(<DataTable columnDefinitions={columnDefinitions} data={makeData(25)} dataKey="uid" />);
    expect(screen.getByText('Row 0')).toBeInTheDocument();
    expect(screen.getByText('Row 9')).toBeInTheDocument();
    expect(screen.queryByText('Row 10')).not.toBeInTheDocument();
});

test('select-all selects rows by dataKey and fires onSelectionChange', () => {
    const onSelectionChange = jest.fn();
    render(
        <DataTable
            columnDefinitions={columnDefinitions}
            data={makeData(3)}
            dataKey="uid"
            selectionMode="multiple"
            gridSettings={{ pageSize: 5 }}
            onSelectionChange={onSelectionChange}
        />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelectionChange).toHaveBeenCalledWith(['u0', 'u1', 'u2']);
});

test('unselect-all fires onSelectionChange with an empty selection', () => {
    const onSelectionChange = jest.fn();
    render(
        <DataTable
            columnDefinitions={columnDefinitions}
            data={makeData(2)}
            dataKey="uid"
            selectionMode="multiple"
            gridSettings={{ pageSize: 5 }}
            onSelectionChange={onSelectionChange}
        />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});

test('toolbar renders no handler-less delete/filter buttons', () => {
    render(<DataTable columnDefinitions={columnDefinitions} data={makeData(2)} dataKey="uid" gridSettings={{ pageSize: 5 }} />);
    expect(screen.queryByLabelText('Filter list')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
});
