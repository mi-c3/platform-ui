import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiAutocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
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
    && {
        /* legacy chip metrics; && outranks MUI's .MuiAutocomplete-tag 3px margin */
        margin: 5px 3px;
        height: 24px;
    }
`;

const ChipIconStyle = styled.div`
    margin: 4px -4px 0 8px;
`;

const LISTBOX_MAX_HEIGHT = 224; // visual parity with the legacy popper cap

// Legacy multi-select field spacing: the chips block clears the shrunk label like the old
// $multiple StyledTextField (padding-top 1.7rem on the filled root).
const MULTIPLE_SX = {
    '&& .MuiFilledInput-root': { paddingTop: '1.7rem' },
    // legacy input sizing: the text input claims most of a row, so it wraps under the chips
    // instead of squeezing next to them
    '&& .MuiAutocomplete-input': { width: 'calc(100% - 80px)', flexGrow: 1, paddingTop: '25px', paddingBottom: '8px' },
};

// Legacy-only props: verified to have zero consumers passing them (call-site extraction across
// the platform-v1 repository); accepted and ignored during the migration window so a stray
// spread cannot crash, with a one-time dev warning so it gets cleaned up.
const DROPPED_PROPS = ['PopperProps', 'optionsOverflow', 'valueId', 'searchDelay'];
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
        VirtualListProps: PropTypes.shape({ itemSize: PropTypes.number }),
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
        'placeholder', 'error', 'helperText', 'slotProps', 'VirtualListProps',
        ...DROPPED_PROPS,
    ];

    static defaultProps = {
        clearable: true,
        options: [],
    };

    // Keeps the clear (x) visible without hover/focus, like the legacy always-visible button.
    static PERSISTENT_CLEAR_SX = { '&& .MuiAutocomplete-clearIndicator': { visibility: 'visible' } };

    state = { open: false, waitingForOptions: false };

    constructor(props) {
        super(props);
        // Last selected option per stored value: keeps the visible label/adornment correct
        // while async options are replaced or cleared by unrelated store updates.
        this.selectedOptionCache = new Map();
        // The query the most recent suggest() was fired with — used to detect that the
        // options currently held by the parent belong to a previous (filtered) session.
        this.lastSuggestQuery = null;
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
        this.lastSuggestQuery = query;
        suggest && suggest({ target: { name, value: query } });
    }, 300);

    componentDidUpdate(prevProps) {
        // A fresh options page (new array ref) or a completed load ends the waiting window —
        // the popup opens only now, so the field spinner (not a loading popup) covers the
        // fetch, like the legacy component.
        if (this.state.waitingForOptions && (prevProps.options !== this.props.options || (prevProps.isLoading && !this.props.isLoading))) {
            this.setState({ waitingForOptions: false });
        }
    }

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
        // suggest on focus). The popup is held closed while the page loads — the user sees
        // the field spinner, then the options, exactly like the legacy behavior; it also
        // means a reopen after a filtered search can never flash the stale filtered rows.
        const { suggest, name } = this.props;
        if (!suggest) {
            this.setState({ open: true });
            return;
        }
        this.setState({ open: true, waitingForOptions: true });
        this.lastSuggestQuery = '';
        suggest({ target: { name, value: '' } });
    }

    @bind
    onClose() {
        this.setState({ open: false, waitingForOptions: false });
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
        const { label, placeholder, error, helperText, name, InputProps, multiple, disabled, value } = this.props;
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
                // A real InputAdornment so MUI (and the platform TextField's
                // adornment rules) vertically center it against the filled box,
                // like the legacy selected-value avatar.
                inputProps.startAdornment = <InputAdornment position="start">{startAdornment}</InputAdornment>;
            }
        }
        inputProps.endAdornment = params.InputProps.endAdornment;
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
        const { open, waitingForOptions } = this.state;
        const presentedOptions = waitingForOptions ? [] : options || [];
        // The loading spinner occupies the suggestion-opener slot, replacing the arrow —
        // exactly where the legacy component put it (15px, vertically centered at the right
        // edge of the filled box).
        const spinnerActive = !!isLoading || waitingForOptions;
        // Legacy row density: consumers control it through VirtualListProps.itemSize
        // (50 default, 60 for avatar-heavy rows); rows are fixed-height and clip, like the
        // legacy virtual list.
        const rowHeight = (this.props.VirtualListProps && this.props.VirtualListProps.itemSize) || 50;

        this.resolvedValue = multiple
            ? resolveOptions(value, options, this.selectedOptionCache, valueField)
            : resolveOption(value, options, this.selectedOptionCache, valueField);

        // Legacy clear affordance: a selected, clearable, enabled single-select shows the
        // always-visible clear (x) and no popup arrow; otherwise the arrow shows.
        const hasSingleSelection = !multiple && this.resolvedValue !== null && this.resolvedValue !== undefined;
        const showPersistentClear = hasSingleSelection && clearable && !disabled;

        return (
            <MuiAutocomplete
                className={className}
                multiple={multiple}
                options={presentedOptions}
                value={this.resolvedValue}
                open={open && !waitingForOptions}
                onChange={this.onChange}
                onInputChange={this.onInputChange}
                onOpen={this.onOpen}
                onClose={this.onClose}
                isOptionEqualToValue={this.isOptionEqualToValue}
                getOptionKey={this.getOptionKey}
                getOptionLabel={this.getOptionLabel}
                filterOptions={this.filterOptions}
                filterSelectedOptions={!!multiple}
                renderOption={this.renderOption}
                renderValue={multiple ? this.renderValue : undefined}
                renderInput={this.renderInput}
                loading={!!isLoading}
                popupIcon={spinnerActive ? <CircularProgress size={15} /> : undefined}
                forcePopupIcon={spinnerActive ? true : (showPersistentClear ? false : true)}
                disabled={disabled}
                disableClearable={!clearable}
                onHighlightChange={this.onHighlightChange}
                openOnFocus
                selectOnFocus
                fullWidth
                sx={[multiple ? MULTIPLE_SX : null, showPersistentClear ? AutocompleteNext.PERSISTENT_CLEAR_SX : null]}
                slotProps={{
                    listbox: {
                        component: VirtualListbox,
                        scrollControllerRef: this.listboxScrollRef,
                        rowHeight,
                        sx: { maxHeight: LISTBOX_MAX_HEIGHT },
                    },
                    ...(slotProps || {}),
                }}
            />
        );
    }
}

export default AutocompleteNext;
