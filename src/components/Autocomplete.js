import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import equals from 'fast-deep-equal';
import VirtualList from 'react-tiny-virtual-list';

import { bind, memoize, debounce } from 'utils/decorators/decoratorUtils';
import Cancel from '@material-ui/icons/Cancel';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, styled } from '@material-ui/styles';

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
        width: ({ multiple }) => `calc(100% - ${multiple ? 80 : 60}px)`,
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
        isLoading: PropTypes.bool,
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
            preSelectedValue: 0,
            selectedOption: -1,
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
        const { value, options, valueField, valueId, suggest, multiple } = this.props;
        if (suggest) {
            return suggest(event);
        }
        const query = get(event, 'target.value');
        const opts = (options || []).filter((opt) =>
            this.optionTemplate(opt)
                .label.toLowerCase()
                .includes(query.toLowerCase())
        );

        const selected = this.getSelectedOptions(value, valueField, options);
        const { label = '' } = !multiple ? this.optionTemplate(selected) : {};
        const isSelectedOption = label === query || selected === null;

        this.setState({
            suggestions: this.filterValue(isSelectedOption ? options : opts, value, valueId, valueField),
        });
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
    onChange(option, query = '') {
        const { onChange, name, value: currentValue, multiple, valueField } = this.props;
        const optionValue = valueField ? get(option, valueField, null) : option;
        const value = !multiple ? optionValue : [...(arrayfy(currentValue) || []), optionValue];
        this.setState(
            { query, preSelectedValue: 0, openSuggestions: false },
            () => onChange && onChange(createEvent('change', { target: { name, value } }))
        );
    }

    @bind
    onSearching(event) {
        if (event.persist) {
            event.persist();
        }
        const query = get(event, 'target.value');

        this.setState(
            () => ({
                query,
                preSelectedValue: 0,
                openSuggestions: true,
            }),
            () => this.suggest(event)
        );
    }

    @bind
    onFocus(/* event */) {
        let { query } = this.state;
        const { multiple } = this.props;
        if (!multiple && !query) {
            const { value, valueField, options } = this.props;
            const selected = this.getSelectedOptions(value, valueField, options);
            const { label = '' } = this.optionTemplate(selected);
            query = label;
        }
        this.onSearching(createEvent('focus', { target: { name: this.props.name, value: query } }));
    }

    @bind
    onBlur() {
        this.setState(() => ({ query: '', openSuggestions: false, preSelectedValue: 0 }));
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
        const { valueField, options } = this.props;
        if (valueField) {
            value = (options || []).find((option) => null === get(option, valueField)) || value;
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

    @bind
    onKeyUp(e) {
        const { value, multiple, valueField, options } = this.props;
        const { suggestions } = this.state;
        if (e.type === 'keyup' && e.key === 'Backspace' && multiple && value && value.length) {
            const { query, preSelectedValue } = this.state;
            if (query === '') {
                let nextPreSelectedValue = get(value, 'length', 0);
                if (preSelectedValue) {
                    const selected = this.getSelectedOptions(value, valueField, options);
                    nextPreSelectedValue = 0;
                    this.buildRemoveChip(selected[preSelectedValue - 1])();
                }
                this.setState({ preSelectedValue: nextPreSelectedValue });
            }
        }
        if (e.type === 'keyup' && e.key === 'ArrowDown') {
            this.setState(({ selectedOption, openSuggestions }) => {
                let nextSelectedOption = selectedOption + 1;
                if (get(suggestions, 'length') === selectedOption) {
                    nextSelectedOption = 0;
                }
                const nextState = { selectedOption: nextSelectedOption };
                if (!openSuggestions) {
                    nextState.openSuggestions = true;
                    nextState.selectedOption = 0;
                }

                return nextState;
            });
        }
        if (e.type === 'keyup' && e.key === 'ArrowUp') {
            this.setState(({ selectedOption, openSuggestions }) => {
                let nextSelectedOption = selectedOption - 1;
                if (nextSelectedOption === -1) {
                    nextSelectedOption = get(suggestions, 'length') - 1;
                }
                const nextState = { selectedOption: nextSelectedOption };
                if (!openSuggestions) {
                    nextState.openSuggestions = true;
                    nextState.selectedOption = get(suggestions, 'length') - 1;
                }
                return nextState;
            });
        }
        if (e.type === 'keyup' && e.key === 'Enter') {
            const { selectedOption, suggestions, query } = this.state;
            if (options[selectedOption]) {
                this.setState({ openSuggestions: false, selectedOption: -1 }, () => this.onChange(suggestions[selectedOption], query));
            }
        }
    }

    /**
     * Builds the suggestion popper.
     */
    @bind
    @memoize(equals)
    buildSuggestionsPopper(suggestions, openSuggestions, VirtualListProps, PopperProps, selectedOption) {
        const maxPopperHeight = 224;
        const { itemSize } = VirtualListProps;
        const maxSuggetionsHeight = suggestions.length * (itemSize + 4);
        const popperHeight = Math.min(maxSuggetionsHeight, get(VirtualListProps, 'height', maxPopperHeight));
        if (popperHeight < maxPopperHeight) {
            this.popperRef.current && this.popperRef.current.popper && this.popperRef.current.popper.update();
        }
        const withOptionStyle = {
            margin: '0px !important',
            padding: '0px !important',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
        };
        const withoutOptionStyle = {
            padding: '15px',
            fontSize: '16px',
            margin: '0 !important',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
        };
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
                                    scrollToAlignment={'auto'}
                                    scrollToIndex={selectedOption}
                                    renderItem={({ index, style }) => {
                                        const op = suggestions[index];
                                        const { label, option } = this.optionTemplate(op);
                                        return (
                                            <div key={index} style={style}>
                                                <MenuItem
                                                    style={option ? withOptionStyle : withoutOptionStyle}
                                                    onClick={this.buildOnChange(op)}
                                                    value={op}
                                                    component="div"
                                                    selected={selectedOption === index}
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
    buildInputProps({ selected, clearable, disabled, multiple, query, InputProps, classes, openSuggestions, isLoading }) {
        const { startAdornment, label = '' } = !multiple ? this.optionTemplate(selected) : {};
        const InputProperties = {
            ...InputProps,
            inputRef: this.inputRef,
            autoComplete: 'off',
            onChange: this.onSearching,
            value: openSuggestions ? query : label,
            onKeyUp: this.onKeyUp,
        };
        if (multiple) {
            InputProperties.startAdornment = (arrayfy(selected) || []).map((option, index) => {
                const { ChipProps: props, startAdornment, label } = this.optionTemplate(option);
                const { preSelectedValue } = this.state;
                const ChipProps = { ...(props || {}) };
                if (startAdornment && !ChipProps.avatar) {
                    ChipProps.icon = <ChipIconStyle>{startAdornment}</ChipIconStyle>;
                }
                if (preSelectedValue && index === preSelectedValue - 1) {
                    ChipProps.color = 'secondary';
                }
                return (
                    <Chip
                        color="primary"
                        key={index}
                        label={label}
                        tabIndex={-1}
                        className={classes.chip}
                        onDelete={this.buildRemoveChip(option)}
                        disabled={disabled}
                        {...ChipProps}
                    />
                );
            });
            InputProperties.classes = { root: classes.inputRoot, input: classes.inputInput };
        } else {
            InputProperties.startAdornment = startAdornment && <AdormentStyle>{startAdornment}</AdormentStyle>;
            if (!InputProperties.endAdornment) {
                if (selected && clearable && !disabled) {
                    InputProperties.endAdornment = (
                        <IconButton aria-label="Clear input" onClick={this.clearInput}>
                            <Cancel />
                        </IconButton>
                    );
                }
            }
        }

        if (!InputProperties.endAdornment) {
            if ((!selected || !clearable || multiple) && !openSuggestions && !disabled) {
                InputProperties.endAdornment = (
                    <IconButton aria-label="Clear input" onBlur={this.onBlur} onFocus={this.onFocus} onKeyUp={this.onKeyUp}>
                        <KeyboardArrowDown />
                    </IconButton>
                );
            }
            if (openSuggestions && !disabled) {
                InputProperties.endAdornment = (
                    <IconButton aria-label="Clear input" onBlur={this.onBlur} onFocus={this.onFocus} onKeyUp={this.onKeyUp}>
                        <KeyboardArrowUp />
                    </IconButton>
                );
            }
        }

        if (isLoading) {
            InputProperties.endAdornment = <CircularProgress size={12} />;
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
        if (typeof value === 'object') {
            return options.find((option) => shallowEquals(value, get(option, valueField))) || value;
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
            isLoading,
            ...restProps
        } = this.props;
        const { suggestions, openSuggestions, query, selectedOption } = this.state;

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
            isLoading,
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
                {this.buildSuggestionsPopper(suggestions, openSuggestions, VirtualListProps, PopperProps, selectedOption)}
            </Fragment>
        );
    }
}

export default withStyles(styles)(Autocomplete);
