import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import equals from 'fast-deep-equal';
import VirtualList from 'react-tiny-virtual-list';

import Cancel from '@material-ui/icons/Cancel';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import { withStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/styles';

import TextField from 'components/TextField';
import { shallowEquals, debounce, arrayfy } from 'utils/utils';
import { get } from 'utils/lo/lo';
import { createEvent } from 'utils/http/event';
import { DarkTheme } from 'styles/theme';

const styles = () => ({
    inputRoot: {
        paddingTop: '1.4rem',
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
});

const ChipStyled = styled(Chip)(({ theme }) => ({
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
}), { defaultTheme: DarkTheme });

const ChipIconStyle = styled('div')({
    margin: '4px -4px 0 8px',
});

const AdormentStyle = styled('div')({
    margin: '21px 7px 0 0',
});

const AdormentOptionStyle = styled('div')({
    margin: '0 7px 0 0',
});

class Autocomplete extends PureComponent {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        options: PropTypes.arrayOf(PropTypes.object),
        valueId: PropTypes.string,
        InputProps: PropTypes.object,
        VirtualListProps: PropTypes.object,
    }

    static defaultProps = {
        clearable: true,
        options: [],
        InputProps: {},
    }

    popperRef = React.createRef();
    inputRef = React.createRef();

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

    suggest = debounce((event) => {
        const { value, options, valueField, valueId, suggest } = this.props;
        if (suggest) {
            return suggest(event);
        }
        const query = get(event, 'target.value');
        const opts = options.filter((opt) => this.optionTemplate(opt).label.toLowerCase().includes(query.toLowerCase()));
        this.setState({ suggestions: this.filterValue(opts, value, valueId, valueField) });
    }, 300);


    getOptionValue = (option) => this.props.valueField ? get(option, this.props.valueField) : option;

    /**
     * Removes the selected option/s (value) from the options.
     */
    filterValue = memoize((options, value, valueId, valueField) => {
        if (!Array.isArray(options) || !options.length || !options) {
            return options || [];
        }
        const getValue = (option) => valueField ? get(option, valueField) : option;
        if (Array.isArray(value)) {
            let values = value;
            if (valueId) {
                values = new Set(values.map(v => get(v, valueId)));
                return options.filter((opt) => !values.has(get(getValue(opt), valueId)));
            }
            return options.filter((opt) => !values.some((val) => equals(getValue(opt), val)));
        }
        return options.filter((opt) => !equals(getValue(opt), value));
    });

    buildOnChange = (value) => () => this.onChange(value);

    onChange = (option) => {
        const { onChange, name, value: currentValue, multiple, valueField } = this.props;
        const optionValue = valueField ? get(option, valueField) : option;
        const value = !multiple ? optionValue : [ ...(arrayfy(currentValue) || []), optionValue ];
        this.setState({ query: '' }, () => onChange && onChange(createEvent('change', { target: { name, value } })));
    };

    onSearching = (event) => {
        if(event.persist) {
            event.persist();
        }
        const query = get(event, 'target.value');
        this.setState({ query, openSuggestions : true }, () => this.suggest(event));
    };

    onFocus = (/* event */) => {
        const { query } = this.state;
        this.onSearching(createEvent('focus', { target: { name, value: query }}));
    }

    onBlur = (/* event */) => this.setState({ query: '' })

    /**
     * Returns the option template of the specified option.
     */
    optionTemplate = (option) => {
        const { optionTemplate } = this.props;
        if (!option) {
            return { label: '', startAdornment: null };
        }
        return optionTemplate ? optionTemplate(option) : { label: option.label, startAdornment: null };
    }

    /**
     * Closes the suggestion popper.
     */
    closeSuggestions = () => {
        this.setState({ openSuggestions: false });
    }

    /**
     * Clear the input (used only when multiple is false).
     */
    clearInput = () => this.onChange(null);

    /**
     * Returns the function to remove a value (chip) (used only when multiple is true).
     */
    buildRemoveChip = (option) => () => {
        const { value, onChange } = this.props;
        const valueToRemove = this.getOptionValue(option);
        const vals = value.filter((v) => v !== valueToRemove);
        this.setState({ query: '' }, () => onChange && onChange(createEvent('change', { target: { name, value: vals } })));
    }

    /**
     * Builds the suggestion popper.
     */
    buildSuggestionsPopper = memoize((suggestions, openSuggestions, VirtualListProps) => {
        const maxPopperHeight = 224;
        const maxSuggetionsHeight = suggestions.length * (get(VirtualListProps, 'itemSize', 25) + 4);
        const popperHeight = Math.min(maxSuggetionsHeight, get(VirtualListProps, 'height', maxPopperHeight));
        if(popperHeight < maxPopperHeight) {
            this.popperRef.current && this.popperRef.current.popper && this.popperRef.current.popper.update();
        }
        return suggestions && suggestions.length > 0 && (
            <Popper ref={this.popperRef} style={{ zIndex: 1 }} open={openSuggestions} anchorEl={get(this.inputRef, 'current.parentNode.parentNode')} transition>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper square style={{ width: get(this.inputRef, 'current.parentNode.clientWidth') }}>
                            <VirtualList
                                width='100%'
                                height={popperHeight}
                                itemCount={suggestions.length}
                                renderItem={({index, style}) => {
                                    const op = suggestions[index];
                                    const { startAdornment, label } = this.optionTemplate(op);
                                    return (
                                        <div key={index} style={style}>
                                            <MenuItem onClick={this.buildOnChange(op)} value={op} style={{ height: '10px', fontWeight: 500 }} component="div">
                                                {startAdornment && <AdormentOptionStyle>{startAdornment}</AdormentOptionStyle>} {label}
                                            </MenuItem>
                                        </div>
                                    );
                                }}
                                {...(VirtualListProps || {})}
                                itemSize={get(VirtualListProps, 'itemSize', 25)}
                            />
                        </Paper>
                    </Grow>
                )}
            </Popper>
        );
    }, shallowEquals)

    /**
     * Builds the input component.
     */
    buildInputProps = memoize(({ selected, clearable, disabled, multiple, query, InputProps, classes, openSuggestions }) => {
        const { startAdornment, label = '' } = !multiple ? this.optionTemplate(selected) : {};
        const InputProperties = {
            inputRef: this.inputRef,
            autoComplete: 'off',
            onChange: this.onSearching,
            value: openSuggestions ? query : label,
            ...InputProps,
        };
        if (multiple) {
            InputProperties.startAdornment = (arrayfy(selected) || []).map((option, index) => {
                const { ChipProps: props, startAdornment, label } = this.optionTemplate(option);
                const ChipProps = { ...(props || {}) };
                if (startAdornment) {
                    ChipProps.icon = <ChipIconStyle>{startAdornment}</ChipIconStyle>;
                }
                return (
                    <ChipStyled
                        color="primary"
                        key={index}
                        label={label}
                        tabIndex={-1}
                        onDelete={this.buildRemoveChip(option)}
                        {...ChipProps}
                    />
                );
            });
            InputProperties.classes = { root: classes.inputRoot, input: classes.inputInput, };
        } else {
            InputProperties.startAdornment = startAdornment && <AdormentStyle>{startAdornment}</AdormentStyle>;
            InputProperties.endAdornment = selected && clearable && !disabled && (
                <IconButton aria-label="Clear input" onClick={this.clearInput} >
                    <Cancel />
                </IconButton>
            );
        }
        return InputProperties;
    }, shallowEquals);

    /**
     * Returns the selected option/s.
     */
    getSelectedOptions = memoize((value, valueField, options) => {
        if (!value || !valueField) {
            return value;
        }
        if (Array.isArray(value)) {
            const values = new Set(value);
            return options.filter(option => values.has(get(option, valueField)));
        }
        return options.find(option => value === get(option, valueField));
    });

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
            ...restProps
        } = this.props;
        const { suggestions, openSuggestions, query } = this.state;
        const selected = this.getSelectedOptions(value, valueField, options);
        const InputProperties = this.buildInputProps({ selected, clearable, disabled, multiple, query, InputProps, classes, openSuggestions });
        return (
            <ClickAwayListener onClickAway={this.closeSuggestions}>
                <div>
                    <TextField
                        InputProps={InputProperties}
                        InputLabelProps={{ shrink: true }}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        disabled={disabled}
                        {...restProps}
                    />
                    {this.buildSuggestionsPopper(suggestions, openSuggestions, VirtualListProps)}
                </div>
            </ClickAwayListener>
        );
    }
}

export default withStyles(styles)(Autocomplete);
