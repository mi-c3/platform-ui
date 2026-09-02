import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiAutocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';

import TextField from 'components/TextField';
import VirtualListbox from 'components/AutocompleteNext/VirtualListbox';
import { bind, debounceFunc } from 'utils/decorators/decoratorUtils';
import {
    resolveOption,
    resolveOptions,
    fromOption,
    isOptionEqualToValue,
    getOptionKey,
} from './valueCodec';

const StyledChip = styled(Chip)`
    margin: 5px 3px;
    height: 24px;
`;

const ChipIconStyle = styled.div`
    margin: 4px -4px 0 8px;
`;

const LISTBOX_MAX_HEIGHT = 224; // visual parity with the legacy popper cap

// Legacy-only props: verified to have zero consumers passing them (call-site extraction across
// the platform-v1 repository); accepted and ignored during the migration window so a stray
// spread cannot crash, with a one-time dev warning so it gets cleaned up.
const DROPPED_PROPS = ['VirtualListProps', 'PopperProps', 'optionsOverflow', 'valueId', 'searchDelay'];
const warned = new Set();

/**
 * Thin adapter between the platform Autocomplete contract and MUI v7's Autocomplete.
 *
 * MUI owns the popup lifecycle, selection, keyboard navigation, filtering, a11y and
 * touch handling — the legacy component's hand-rolled Popper + ClickAwayListener assembly
 * lost mobile taps to a touchend/click race (see platform-v1
 * docs/autocomplete-modernization.md for the full contract and root cause).
 *
 * Preserved contract: onChange({ target: { name, value } }); value is the whole option
 * object, or the option's `valueField` (usually a primitive); `multiple` stores arrays;
 * async consumers own `options`/`isLoading` and load via `suggest(event)`;
 * `optionTemplate(option) => { label, startAdornment, ChipProps, option }`.
 */
class AutocompleteNext extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        clearable: PropTypes.bool,
        disabled: PropTypes.bool,
        InputProps: PropTypes.object,
        multiple: PropTypes.bool,
        name: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        options: PropTypes.array,
        optionTemplate: PropTypes.func,
        suggest: PropTypes.func,
        value: PropTypes.any,
        valueField: PropTypes.string,
        isLoading: PropTypes.bool,
        label: PropTypes.node,
        placeholder: PropTypes.string,
        error: PropTypes.bool,
        helperText: PropTypes.node,
    };

    // Everything else spreads onto the platform TextField, like the legacy component's
    // rest-spread (consumers pass e.g. `variant`, `onFocus`, `id`).
    static OWN_PROPS = [
        'className', 'clearable', 'disabled', 'InputProps', 'multiple', 'name', 'onChange',
        'options', 'optionTemplate', 'suggest', 'value', 'valueField', 'isLoading', 'label',
        'placeholder', 'error', 'helperText', 'slotProps',
        ...DROPPED_PROPS,
    ];

    static defaultProps = {
        clearable: true,
        options: [],
    };

    constructor(props) {
        super(props);
        // Last selected option per stored value: keeps the visible label/adornment correct
        // while async options are replaced or cleared by unrelated store updates.
        this.selectedOptionCache = new Map();
        // Filled by the VirtualListbox with { scrollToIndex } — MUI's own scroll-into-view
        // only finds options that are currently rendered.
        this.listboxScrollRef = React.createRef();
        if (process.env.NODE_ENV !== 'production') {
            DROPPED_PROPS.filter(prop => props[prop] !== undefined && !warned.has(prop)).forEach(prop => {
                warned.add(prop);
                // eslint-disable-next-line no-console
                console.warn(
                    `AutocompleteNext: the legacy prop \`${prop}\` is not supported and is ignored. ` +
                        'Remove it from the consumer (see docs/components/AutocompleteNext.md).'
                );
            });
        }
    }

    suggestDebounced = debounceFunc(query => {
        const { suggest, name } = this.props;
        suggest && suggest({ target: { name, value: query } });
    }, 300);

    @bind
    getTemplate(option) {
        const { optionTemplate } = this.props;
        if (option === null || option === undefined) {
            return { label: '' };
        }
        if (optionTemplate) {
            return optionTemplate(option) || { label: '' };
        }
        if (typeof option !== 'object') {
            return { label: String(option) };
        }
        return { label: option.label !== undefined ? option.label : option.name };
    }

    @bind
    getOptionLabel(option) {
        const { label } = this.getTemplate(option);
        if (label !== null && label !== undefined && label !== '') {
            return String(label);
        }
        return typeof option === 'object' || option === null || option === undefined ? '' : String(option);
    }

    @bind
    cacheSelected(option) {
        const { valueField } = this.props;
        if (!valueField || option === null || typeof option !== 'object') {
            return;
        }
        const stored = fromOption(option, valueField);
        if (stored !== null && stored !== undefined && typeof stored !== 'object') {
            this.selectedOptionCache.set(stored, option);
        }
    }

    @bind
    onChange(event, selection) {
        const { onChange, name, multiple, valueField } = this.props;
        let value;
        if (multiple) {
            (selection || []).forEach(this.cacheSelected);
            value = (selection || []).map(option => fromOption(option, valueField));
        } else {
            this.cacheSelected(selection);
            value = fromOption(selection, valueField);
        }
        onChange && onChange({ target: { name, value } });
    }

    @bind
    onInputChange(event, inputValue, reason) {
        if (reason === 'input') {
            this.suggestDebounced(inputValue);
        }
    }

    @bind
    onOpen() {
        // Async consumers load their first page on open (the legacy component fired its
        // suggest on focus). An empty query asks for the unfiltered first page — reopening a
        // field with a selection shows the full list instead of the legacy empty popper.
        const { suggest, name } = this.props;
        suggest && suggest({ target: { name, value: '' } });
    }

    @bind
    isOptionEqualToValue(option, value) {
        return isOptionEqualToValue(option, value, this.props.valueField);
    }

    @bind
    getOptionKey(option) {
        return getOptionKey(option, this.props.valueField);
    }

    @bind
    filterOptions(options, state) {
        // Server-filtered consumers pass `suggest`; filtering again locally would fight the
        // backend (and the input shows the selected label, which must not filter the list).
        let filtered = options;
        if (!this.props.suggest) {
            if (!this.localFilter) {
                this.localFilter = createFilterOptions({ stringify: this.getOptionLabel });
            }
            filtered = this.localFilter(options, state);
        }
        // the presented order, so onHighlightChange can map an option to its listbox index
        this.presentedOptions = filtered;
        return filtered;
    }

    @bind
    onHighlightChange(event, option) {
        const controller = this.listboxScrollRef.current;
        if (!controller || option === null || option === undefined) {
            return;
        }
        const index = (this.presentedOptions || []).indexOf(option);
        if (index >= 0) {
            controller.ensureIndexVisible(index);
        }
    }

    @bind
    renderOption(liProps, option) {
        const { key, ...rest } = liProps;
        const { label, startAdornment, option: custom } = this.getTemplate(option);
        return (
            <li key={key} {...rest}>
                {custom || (
                    <React.Fragment>
                        {startAdornment}
                        {label}
                    </React.Fragment>
                )}
            </li>
        );
    }

    @bind
    renderValue(selection, getItemProps) {
        const { disabled } = this.props;
        return selection.map((option, index) => {
            const { label, startAdornment, ChipProps: templateChipProps } = this.getTemplate(option);
            const ChipProps = { ...(templateChipProps || {}) };
            if (startAdornment && !ChipProps.avatar) {
                ChipProps.icon = <ChipIconStyle>{startAdornment}</ChipIconStyle>;
            }
            const { key, ...itemProps } = getItemProps({ index });
            return (
                <Tooltip title={label} key={key}>
                    <StyledChip color="primary" label={label} disabled={disabled} {...itemProps} {...ChipProps} />
                </Tooltip>
            );
        });
    }

    @bind
    renderInput(params) {
        const { label, placeholder, error, helperText, name, isLoading, InputProps, multiple, disabled, value } = this.props;
        const restProps = Object.keys(this.props)
            .filter(key => !AutocompleteNext.OWN_PROPS.includes(key))
            .reduce((acc, key) => {
                acc[key] = this.props[key];
                return acc;
            }, {});
        const inputProps = { ...params.InputProps, ...(InputProps || {}) };
        if (!multiple && !inputProps.startAdornment) {
            const { startAdornment } = this.getTemplate(this.resolvedValue);
            if (startAdornment) {
                inputProps.startAdornment = startAdornment;
            }
        }
        inputProps.endAdornment = (
            <React.Fragment>
                {isLoading ? <CircularProgress size={16} /> : null}
                {params.InputProps.endAdornment}
            </React.Fragment>
        );
        return (
            <TextField
                {...params}
                {...restProps}
                label={label}
                placeholder={placeholder}
                error={error}
                helperText={helperText}
                name={name}
                autocompleteMultiple={multiple}
                // MUI's popup/clear indicators own the end adornment; the TextField's own
                // clear button would duplicate them.
                clearable={false}
                hideInput={multiple ? disabled : disabled && !value}
                InputProps={inputProps}
                InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
            />
        );
    }

    render() {
        const {
            className,
            clearable,
            disabled,
            multiple,
            options,
            value,
            valueField,
            isLoading,
            slotProps,
        } = this.props;

        this.resolvedValue = multiple
            ? resolveOptions(value, options, this.selectedOptionCache, valueField)
            : resolveOption(value, options, this.selectedOptionCache, valueField);

        return (
            <MuiAutocomplete
                className={className}
                multiple={multiple}
                options={options || []}
                value={this.resolvedValue}
                onChange={this.onChange}
                onInputChange={this.onInputChange}
                onOpen={this.onOpen}
                isOptionEqualToValue={this.isOptionEqualToValue}
                getOptionKey={this.getOptionKey}
                getOptionLabel={this.getOptionLabel}
                filterOptions={this.filterOptions}
                filterSelectedOptions={!!multiple}
                renderOption={this.renderOption}
                renderValue={multiple ? this.renderValue : undefined}
                renderInput={this.renderInput}
                loading={!!isLoading}
                disabled={disabled}
                disableClearable={!clearable}
                onHighlightChange={this.onHighlightChange}
                openOnFocus
                selectOnFocus
                fullWidth
                slotProps={{
                    listbox: {
                        component: VirtualListbox,
                        scrollControllerRef: this.listboxScrollRef,
                        sx: { maxHeight: LISTBOX_MAX_HEIGHT },
                    },
                    ...(slotProps || {}),
                }}
            />
        );
    }
}

export default AutocompleteNext;
