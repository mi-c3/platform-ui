import React from 'react';
import { render, fireEvent, act, screen, within } from '@testing-library/react';

import AutocompleteNext from '../../src/components/AutocompleteNext/AutocompleteNext';

const USERS = [
    { id: '1', name: 'Alice', uri: 'user/alice' },
    { id: '2', name: 'Bob', uri: 'user/bob' },
    { id: '3', name: 'Carol', uri: 'user/carol' },
];

const template = option =>
    typeof option === 'object' ? { label: option.name } : { label: String(option) };

const renderNext = (props = {}) =>
    render(<AutocompleteNext name="field" onChange={() => {}} optionTemplate={template} options={USERS} {...props} />);

const openPopup = input => {
    fireEvent.mouseDown(input);
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
};

describe('selection and the onChange contract', () => {
    test('single select emits {target:{name,value}} with the whole option (no valueField)', () => {
        const onChange = jest.fn();
        renderNext({ onChange });
        const input = screen.getByRole('combobox');
        openPopup(input);
        fireEvent.click(screen.getByText('Bob'));
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'field', value: USERS[1] } });
    });

    test('single select with valueField emits the primitive', () => {
        const onChange = jest.fn();
        renderNext({ onChange, valueField: 'uri' });
        const input = screen.getByRole('combobox');
        openPopup(input);
        fireEvent.click(screen.getByText('Carol'));
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'field', value: 'user/carol' } });
    });

    test('multiple select with valueField emits an array of primitives', () => {
        const onChange = jest.fn();
        renderNext({ onChange, valueField: 'uri', multiple: true, value: [] });
        const input = screen.getByRole('combobox');
        openPopup(input);
        fireEvent.click(screen.getByText('Alice'));
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'field', value: ['user/alice'] } });
    });

    test('clearing emits null', () => {
        const onChange = jest.fn();
        renderNext({ onChange, valueField: 'uri', value: 'user/alice' });
        fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
        const clear = screen.getByLabelText('Clear');
        fireEvent.click(clear);
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'field', value: null } });
    });
});

describe('value display', () => {
    test('primitive value displays its option label', () => {
        renderNext({ valueField: 'uri', value: 'user/bob' });
        expect(screen.getByRole('combobox')).toHaveValue('Bob');
    });

    test('label survives options churn: options emptied while a value is selected', () => {
        const { rerender } = renderNext({ valueField: 'uri', value: null });
        const input = screen.getByRole('combobox');
        openPopup(input);
        fireEvent.click(screen.getByText('Bob'));
        // parent stores the primitive and — like a real store-churn scenario — the options list empties
        rerender(
            <AutocompleteNext
                name="field"
                onChange={() => {}}
                optionTemplate={template}
                options={[]}
                valueField="uri"
                value="user/bob"
            />
        );
        expect(screen.getByRole('combobox')).toHaveValue('Bob');
    });

    test('unknown primitive value falls back to the template placeholder path', () => {
        renderNext({ valueField: 'uri', value: 'user/ghost', options: [] });
        expect(screen.getByRole('combobox')).toHaveValue('user/ghost');
    });

    test('multiple renders chips with labels', () => {
        renderNext({ valueField: 'uri', multiple: true, value: ['user/alice', 'user/carol'] });
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Carol')).toBeInTheDocument();
    });

    test('chip delete emits the reduced array', () => {
        const onChange = jest.fn();
        renderNext({ onChange, valueField: 'uri', multiple: true, value: ['user/alice', 'user/carol'] });
        const aliceChip = screen.getByText('Alice').closest('.MuiChip-root');
        fireEvent.click(within(aliceChip).getByTestId('CancelIcon'));
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'field', value: ['user/carol'] } });
    });
});

describe('popup lifecycle under options churn (the legacy bug class)', () => {
    test('popup stays open when options are cleared while open, and works after repopulate', () => {
        const { rerender } = renderNext({ suggest: () => {}, options: USERS });
        const input = screen.getByRole('combobox');
        openPopup(input);
        expect(screen.getByRole('listbox')).toBeInTheDocument();

        rerender(
            <AutocompleteNext name="field" onChange={() => {}} optionTemplate={template} suggest={() => {}} options={[]} isLoading />
        );
        // the popup must NOT unmount — it shows the loading state instead
        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(screen.getByText('Loading…')).toBeInTheDocument();

        const onChange = jest.fn();
        rerender(
            <AutocompleteNext name="field" onChange={onChange} optionTemplate={template} suggest={() => {}} options={USERS} />
        );
        fireEvent.click(screen.getByText('Bob'));
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'field', value: USERS[1] } });
    });

    test('no options shows the empty state instead of unmounting the popup', () => {
        renderNext({ suggest: () => {}, options: [] });
        openPopup(screen.getByRole('combobox'));
        expect(screen.getByText('No options')).toBeInTheDocument();
    });
});

describe('mobile touch sequence (regression: tap-select lost to touchend race)', () => {
    test('touchstart/touchend on an option then click still selects it', () => {
        const onChange = jest.fn();
        renderNext({ onChange });
        const input = screen.getByRole('combobox');
        openPopup(input);
        const option = screen.getByText('Alice');
        // the browser's mobile compat sequence
        fireEvent.touchStart(option);
        fireEvent.touchEnd(option);
        // the option must still be mounted for the synthesized click
        expect(screen.getByText('Alice')).toBeInTheDocument();
        fireEvent.click(option);
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'field', value: USERS[0] } });
    });
});

describe('async suggest', () => {
    test('typing debounces suggest at 300ms with the {target:{name,value}} shape', () => {
        jest.useFakeTimers();
        try {
            const suggest = jest.fn();
            renderNext({ suggest });
            const input = screen.getByRole('combobox');
            fireEvent.change(input, { target: { value: 'al' } });
            // opening the popup fires the immediate first-page suggest ('') — the typed query
            // itself must stay debounced
            act(() => {
                jest.advanceTimersByTime(200);
            });
            expect(suggest).not.toHaveBeenCalledWith({ target: { name: 'field', value: 'al' } });
            act(() => {
                jest.advanceTimersByTime(200);
            });
            expect(suggest).toHaveBeenCalledWith({ target: { name: 'field', value: 'al' } });
        } finally {
            jest.useRealTimers();
        }
    });

    test('opening fires suggest with an empty query (first-page load)', () => {
        const suggest = jest.fn();
        renderNext({ suggest });
        openPopup(screen.getByRole('combobox'));
        expect(suggest).toHaveBeenCalledWith({ target: { name: 'field', value: '' } });
    });

    test('selecting an option does not fire suggest', () => {
        jest.useFakeTimers();
        try {
            const suggest = jest.fn();
            renderNext({ suggest });
            openPopup(screen.getByRole('combobox'));
            suggest.mockClear();
            fireEvent.click(screen.getByText('Bob'));
            act(() => {
                jest.advanceTimersByTime(500);
            });
            expect(suggest).not.toHaveBeenCalled();
        } finally {
            jest.useRealTimers();
        }
    });

    test('server-filtered mode does not filter locally (selected label must not empty the list)', () => {
        renderNext({ suggest: () => {}, value: USERS[1], options: USERS });
        openPopup(screen.getByRole('combobox'));
        // input shows "Bob" but all three options stay visible
        expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    test('without suggest, local filtering works over template labels', () => {
        renderNext({});
        const input = screen.getByRole('combobox');
        openPopup(input);
        fireEvent.change(input, { target: { value: 'car' } });
        const listbox = screen.getByRole('listbox');
        expect(within(listbox).getByText('Carol')).toBeInTheDocument();
        expect(within(listbox).queryByText('Alice')).toBeNull();
    });
});

describe('states', () => {
    test('disabled with a value keeps the input, disabled', () => {
        renderNext({ disabled: true, valueField: 'uri', value: 'user/alice' });
        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    test('disabled empty single-select hides the input box (legacy hideInput parity)', () => {
        renderNext({ disabled: true });
        // visibility:hidden removes it from the a11y tree — that is the parity assertion
        expect(screen.queryByRole('combobox')).toBeNull();
        expect(screen.getByRole('combobox', { hidden: true })).toBeDisabled();
    });

    test('error + helperText render', () => {
        renderNext({ error: true, helperText: 'Required' });
        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    test('custom option JSX from the template is rendered', () => {
        const custom = option =>
            typeof option === 'object'
                ? { label: option.name, option: <span data-testid={`row-${option.id}`}>{option.name}!</span> }
                : { label: String(option) };
        renderNext({ optionTemplate: custom });
        openPopup(screen.getByRole('combobox'));
        expect(screen.getByTestId('row-1')).toHaveTextContent('Alice!');
    });

    test('dropped legacy props warn once in dev and do not crash', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        renderNext({ VirtualListProps: { itemSize: 60 } });
        expect(warn).toHaveBeenCalledTimes(1);
        renderNext({ VirtualListProps: { itemSize: 60 } });
        expect(warn).toHaveBeenCalledTimes(1);
        warn.mockRestore();
    });

    test('keyboard: ArrowDown + Enter selects the highlighted option', () => {
        const onChange = jest.fn();
        renderNext({ onChange });
        const input = screen.getByRole('combobox');
        fireEvent.focus(input);
        // openOnFocus opens the popup on focus, so each ArrowDown moves the highlight
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(onChange).toHaveBeenCalledWith({ target: { name: 'field', value: USERS[1] } });
    });
});

describe('rest-prop passthrough (legacy rest-spread parity)', () => {
    test('variant and onFocus reach the TextField/input', () => {
        const onFocus = jest.fn();
        render(
            <AutocompleteNext
                name="field"
                onChange={() => {}}
                options={USERS}
                optionTemplate={template}
                variant="outlined"
                onFocus={onFocus}
            />
        );
        const input = screen.getByRole('combobox');
        fireEvent.focus(input);
        expect(onFocus).toHaveBeenCalled();
        expect(document.querySelector('.MuiOutlinedInput-root')).not.toBeNull();
    });
});
