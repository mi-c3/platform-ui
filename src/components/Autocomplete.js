import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import equals from 'fast-deep-equal';
import VirtualList from 'react-tiny-virtual-list';

import { bind, memoize, debounce } from 'utils/decorators/decoratorUtils';
import Cancel from '@material-ui/icons/Cancel';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import { withStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/styles';

import TextField from 'components/TextField';
import { shallowEquals, arrayfy } from 'utils/utils';
import { get } from 'utils/lo/lo';
import { createEvent } from 'utils/http/event';

const styles = () => ({
    inputRoot: {
        paddingTop: '1.7rem',
        flexWrap: 'wrap',
    },
    inputInput: {
        width: '100%',
        flexGrow: 1,
    },
    chip: {
        margin: '5px 3px',
        height: '24px',
    },
});

const ChipIconStyle = styled('div')({
    margin: '4px -4px 0 8px',
});

const AdormentStyle = styled('div')({
    margin: '21px 7px 0 0',
});

class Autocomplete extends PureComponent {
    static propTypes = {
        classes: PropTypes.object,
        clearable: PropTypes.bool,
        disabled: PropTypes.bool,
        InputProps: PropTypes.object,
        multiple: PropTypes.bool,
        name: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        optionTemplate: PropTypes.func,
        searchDelay: PropTypes.number,
        suggest: PropTypes.func,
        value: PropTypes.any,
        valueField: PropTypes.string,
        valueId: PropTypes.string,
        VirtualListProps: PropTypes.object,
        PopperProps: PropTypes.object,
    };

    static defaultProps = {
        clearable: true,
        options: [],
        InputProps: {},
        PopperProps: {},
        VirtualListProps: {
            itemSize: 50,
        },
    };

    constructor(props) {
        super(props);
        const { options, value, valueField, valueId } = props;
        this.state = {
            suggestions: this.filterValue(options, value, valueId, valueField),
            openSuggestions: false,
            query: '',
        };
    }

    componentDidUpdate(prevProps) {
        const { options, value, valueField, valueId } = this.props;
        if (prevProps.options !== options || prevProps.value !== value) {
            this.setState({ suggestions: this.filterValue(options, value, valueId, valueField) });
        }
    }

    popperRef = React.createRef();
    inputRef = React.createRef();

    @bind
    @debounce()
    suggest(event) {
        const { value, options, valueField, valueId, suggest } = this.props;
        if (suggest) {
            return suggest(event);
        }
        const query = get(event, 'target.value');
        const opts = (options || []).filter((opt) =>
            this.optionTemplate(opt)
                .label.toLowerCase()
                .includes(query.toLowerCase())
        );
        this.setState({ suggestions: this.filterValue(opts, value, valueId, valueField) });
    }

    @bind
    getOptionValue(option) {
        return this.props.valueField ? get(option, this.props.valueField) : option;
    }

    /**
     * Removes the selected option/s (value) from the options.
     */
    @bind
    @memoize()
    filterValue(options, value, valueId, valueField) {
        if (!Array.isArray(options) || !options.length || !options) {
            return options || [];
        }
        const getValue = (option) => (valueField ? get(option, valueField) : option);
        if (Array.isArray(value)) {
            let values = value;
            if (valueId) {
                values = new Set(values.map((v) => get(v, valueId)));
                return options.filter((opt) => !values.has(get(getValue(opt), valueId)));
            }
            return options.filter((opt) => !values.some((val) => equals(getValue(opt), val)));
        }
        return options.filter((opt) => !equals(getValue(opt), value));
    }

    @bind
    buildOnChange(value) {
        return () => this.onChange(value);
    }

    @bind
    onChange(option) {
        const { onChange, name, value: currentValue, multiple, valueField } = this.props;
        const optionValue = valueField ? get(option, valueField) : option;
        const value = !multiple ? optionValue : [...(arrayfy(currentValue) || []), optionValue];
        this.setState({ query: '' }, () => onChange && onChange(createEvent('change', { target: { name, value } })));
    }

    @bind
    onSearching(event) {
        if (event.persist) {
            event.persist();
        }
        const query = get(event, 'target.value');
        this.setState({ query, openSuggestions: true }, () => this.suggest(event));
    }

    @bind
    onFocus(/* event */) {
        const { query } = this.state;
        this.onSearching(createEvent('focus', { target: { name: this.props.name, value: query } }));
    }

    @bind
    onBlur() {
        this.setState({ query: '', openSuggestions: false });
    }

    /**
     * Returns the option template of the specified option.
     */
    @bind
    optionTemplate(option) {
        const { optionTemplate } = this.props;
        if (!option) {
            return { label: '', startAdornment: null };
        }
        return optionTemplate ? optionTemplate(option) : { label: option.label, startAdornment: null };
    }

    /**
     * Clear the input (used only when multiple is false).
     */
    @bind
    clearInput() {
        let value = null;
        if (this.props.valueField) {
            value = this.props.options.find((option) => null === get(option, this.props.valueField)) || value;
        }
        this.onChange(value);
    }

    /**
     * Returns the function to remove a value (chip) (used only when multiple is true).
     */
    @bind
    buildRemoveChip(option) {
        return () => {
            const { value, onChange } = this.props;
            const valueToRemove = this.getOptionValue(option);
            const vals = value.filter((v) => v !== valueToRemove);
            this.setState(
                { query: '' },
                () => onChange && onChange(createEvent('change', { target: { name: this.props.name, value: vals } }))
            );
        };
    }

    /**
     * Builds the suggestion popper.
     */
    @bind
    @memoize(equals)
    buildSuggestionsPopper(suggestions, openSuggestions, VirtualListProps, PopperProps) {
        const maxPopperHeight = 224;
        const { itemSize } = VirtualListProps;
        const maxSuggetionsHeight = suggestions.length * (itemSize + 4);
        const popperHeight = Math.min(maxSuggetionsHeight, get(VirtualListProps, 'height', maxPopperHeight));
        if (popperHeight < maxPopperHeight) {
            this.popperRef.current && this.popperRef.current.popper && this.popperRef.current.popper.update();
        }
        return (
            suggestions &&
            suggestions.length > 0 && (
                <Popper
                    style={{ zIndex: 1500 }}
                    transition
                    {...PopperProps}
                    open={openSuggestions}
                    ref={this.popperRef}
                    anchorEl={get(this.inputRef, 'current.parentNode.parentNode')}
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper square style={{ width: get(this.inputRef, 'current.parentNode.clientWidth') }}>
                                <VirtualList
                                    width="100%"
                                    height={popperHeight}
                                    itemCount={suggestions.length}
                                    renderItem={({ index, style }) => {
                                        const op = suggestions[index];
                                        const { label, option } = this.optionTemplate(op);
                                        return (
                                            <div key={index} style={style}>
                                                <MenuItem
                                                    style={{ padding: '15px', fontSize: '16px' }}
                                                    onClick={this.buildOnChange(op)}
                                                    value={op}
                                                    component="div"
                                                >
                                                    {option || label}
                                                </MenuItem>
                                            </div>
                                        );
                                    }}
                                    {...VirtualListProps}
                                    itemSize={VirtualListProps.itemSize}
                                />
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            )
        );
    }

    /**
     * Builds the input component.
     */
    @bind
    @memoize(shallowEquals)
    buildInputProps({ selected, clearable, disabled, multiple, query, InputProps, classes, openSuggestions }) {
        const { startAdornment, label = '' } = !multiple ? this.optionTemplate(selected) : {};
        const InputProperties = {
            ...InputProps,
            inputRef: this.inputRef,
            autoComplete: 'off',
            onChange: this.onSearching,
            value: openSuggestions ? query : label,
        };
        if (multiple) {
            InputProperties.startAdornment = (arrayfy(selected) || []).map((option, index) => {
                const { ChipProps: props, startAdornment, label } = this.optionTemplate(option);
                const ChipProps = { ...(props || {}) };
                if (startAdornment && !ChipProps.avatar) {
                    ChipProps.icon = <ChipIconStyle>{startAdornment}</ChipIconStyle>;
                }
                return (
                    <Chip
                        color="primary"
                        key={index}
                        label={label}
                        tabIndex={-1}
                        className={classes.chip}
                        onDelete={this.buildRemoveChip(option)}
                        {...ChipProps}
                    />
                );
            });
            InputProperties.classes = { root: classes.inputRoot, input: classes.inputInput };
        } else {
            InputProperties.startAdornment = startAdornment && <AdormentStyle>{startAdornment}</AdormentStyle>;
            InputProperties.endAdornment = selected && clearable && !disabled && (
                <IconButton aria-label="Clear input" onClick={this.clearInput}>
                    <Cancel />
                </IconButton>
            );
        }
        return InputProperties;
    }

    /**
     * Returns the selected option/s.
     */
    @bind
    @memoize(equals)
    getSelectedOptions(value, valueField, options) {
        if (!valueField || !options) {
            return value;
        }
        if (Array.isArray(value)) {
            const values = new Set(value);
            return options.filter((option) => values.has(get(option, valueField)));
        }
        return options.find((option) => value === get(option, valueField)) || value;
    }

    render() {
        const {
            classes,
            valueId, // eslint-disable-line no-unused-vars
            suggest, // eslint-disable-line no-unused-vars
            optionTemplate, // eslint-disable-line no-unused-vars
            value,
            searchDelay, // eslint-disable-line no-unused-vars
            multiple,
            disabled,
            clearable,
            InputProps,
            VirtualListProps,
            valueField,
            options,
            PopperProps,
            ...restProps
        } = this.props;
        const { suggestions, openSuggestions, query } = this.state;
        const selected = this.getSelectedOptions(value, valueField, options);
        const InputProperties = this.buildInputProps({
            selected,
            clearable,
            disabled,
            multiple,
            query,
            InputProps,
            classes,
            openSuggestions,
        });
        return (
            <Fragment>
                <TextField
                    InputProps={InputProperties}
                    InputLabelProps={{ shrink: true }}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    disabled={disabled}
                    autoComplete="off"
                    {...restProps}
                />
                {this.buildSuggestionsPopper(suggestions, openSuggestions, VirtualListProps, PopperProps)}
            </Fragment>
        );
    }
}

export default withStyles(styles)(Autocomplete);
