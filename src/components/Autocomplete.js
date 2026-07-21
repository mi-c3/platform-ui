import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import equals from 'fast-deep-equal';
import VirtualList from 'react-tiny-virtual-list';

import { bind, memoize, debounce, debounceFunc } from 'utils/decorators/decoratorUtils';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import CircularProgress from '@mui/material/CircularProgress';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Tooltip from '@mui/material/Tooltip';
import styled, { css } from 'styled-components';

import MdiIcon from 'components/MdiIcon';
import TextField from 'components/TextField';
import { shallowEquals, arrayfy, isObject } from 'utils/utils';
import { get } from 'utils/lo/lo';

const StyledTextField = styled(TextField)`
    & .MuiFilledInput-root.MuiInputBase-adornedStart div:not(.MuiChip-root) > .MuiAvatar-root {
        position: relative;
        top: -10px;
    }
    & .MuiFilledInput-root.MuiInputBase-adornedStart > div:not(.MuiChip-root) > .MuiIcon-root {
        position: relative;
        top: -10px;
    }
    ${({ $multiple }) => $multiple && css`
        & .MuiFilledInput-root {
            padding-top: 1.7rem;
            flex-wrap: wrap;
        }
        & .MuiFilledInput-input {
            width: calc(100% - 80px);
            flex-grow: 1;
        }
    `}
`;

const StyledChip = styled(Chip)`
    margin: 5px 3px;
    height: 24px;
`;

const ChipIconStyle = styled.div`
    margin: 4px -4px 0 8px;
`;

const AdormentStyle = styled.div`
    margin: 21px 7px 0 0;
`;

const AdormentIconStyle = styled.div`
    margin: 7px 0px 0 0;
`;

class Autocomplete extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
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
        optionsOverflow: PropTypes.oneOf(['scroll', 'hidden']),
    };

    static defaultProps = {
        clearable: true,
        options: [],
        InputProps: {},
        PopperProps: {},
        VirtualListProps: {
            itemSize: 50,
        },
        optionsOverflow: 'scroll',
    };

    constructor(props) {
        super(props);
        const { options, value, valueField, valueId } = props;
        this.state = {
            suggestions: this.filterValue(options, value, valueId, valueField),
            openSuggestions: false,
            query: '',
            preSelectedValue: 0,
            virtualListKey: Math.random(),
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
    virtualListRef = React.createRef();

    // debounced per instance so the `searchDelay` prop is honored
    suggest = debounceFunc((event) => this.performSuggest(event), this.props.searchDelay ?? 300);

    @bind
    performSuggest(event) {
        const { value, options, valueField, valueId, suggest, multiple } = this.props;
        if (suggest) {
            return suggest(event);
        }
        const query = get(event, 'target.value', '');

        if (!query) {
            this.setState({
                suggestions: this.filterValue(options, value, valueId, valueField),
            });
            return;
        }

        const opts = (options || []).filter((opt) =>
            this.optionTemplate(opt)
                .label.toLowerCase()
                .includes(query.toLowerCase())
        );

        const selected = this.getSelectedOptions(value, valueField, options);
        const { label = '' } = !multiple ? this.optionTemplate(selected) : {};
        const isSelectedOption = label === query;

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
        this.setState({ query, preSelectedValue: 0, openSuggestions: false }, () => onChange && onChange({ target: { name, value } }));
    }

    @bind
    onSearching(event) {
        if (event.persist) {
            event.persist();
        }
        const query = get(event, 'target.value');

        this.setState(
            () => ({
                virtualListKey: Math.random(),
                query,
                preSelectedValue: 0,
                openSuggestions: true,
            }),
            () => this.suggest(event)
        );
    }

    @bind
    handleOpen() {
        let { query } = this.state;
        const { multiple } = this.props;
        if (!multiple && !query) {
            const { value, valueField, options } = this.props;
            const selected = this.getSelectedOptions(value, valueField, options);
            const { label = '' } = this.optionTemplate(selected);
            query = label;
        }
        this.onSearching({ target: { name: this.props.name, value: query } });
    }

    @bind
    handleClose() {
        if (this.state.openSuggestions) {
            this.setState(() => ({ query: '', openSuggestions: false, preSelectedValue: 0 }));
        }
    }

    @bind
    onClickArrow() {
        if (this.state.openSuggestions) {
            this.handleClose();
        } else {
            this.handleOpen();
        }
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

            const vals = value.filter((v) => {
                if (isObject(valueToRemove)) {
                    return !equals(v, valueToRemove);
                }
                return v !== valueToRemove;
            });

            this.setState({ query: '' }, () => onChange && onChange({ target: { name: this.props.name, value: vals } }));
        };
    }

    /**
     * Applies overflow styles based on the optionsOverflow prop.
     */
    @bind
    applyOverflowStyles(baseStyle = {}) {
        const { optionsOverflow } = this.props;
        const style = { ...baseStyle };
        if (optionsOverflow === 'hidden') {
            style.overflow = 'hidden';
            style.textOverflow = 'ellipsis';
            style.whiteSpace = 'nowrap';
        } else if (optionsOverflow === 'scroll') {
            // Force width to be fit-content initially, then JavaScript will set actual width
            style.width = 'fit-content';
            style.minWidth = '100%';
        }
        return style;
    }

    /**
     * Synchronizes all MenuItem widths to match the widest item after render.
     */
    @bind
    @debounce()
    syncMenuItemWidths() {
        if (this.virtualListRef.current && this.virtualListRef.current.rootNode) {
            const rootNode = this.virtualListRef.current.rootNode;
            const menuItems = rootNode.querySelectorAll('.MuiMenuItem-root');

            if (menuItems.length === 0) return;
            
            const hasVerticalScroll = rootNode.scrollHeight > rootNode.clientHeight;

            // Find the maximum width
            let maxWidth = 0;
            menuItems.forEach(item => {
                const itemWidth = item.scrollWidth;
                if (itemWidth > maxWidth) {
                    maxWidth = itemWidth;
                }
            });

            // If there's no vertical scroll, deduct 9px for scrollbar space
            if (!hasVerticalScroll) {
                maxWidth = maxWidth - 9;
            }

            // Apply max width to all items
            menuItems.forEach(item => {
                item.style.width = `${maxWidth}px`;
            });
        }
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
        if (e.type === 'keyup' && e.key === 'Escape') {
            this.handleClose();
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
                            <Paper square style={{ width: get(this.inputRef, 'current.parentNode.clientWidth'), overflowX: 'auto', overflowY: 'hidden' }}>
                                <VirtualList
                                    key={this.state.virtualListKey}
                                    ref={this.virtualListRef}
                                    width="100%"
                                    height={popperHeight}
                                    itemCount={suggestions.length}
                                    scrollToAlignment={'auto'}
                                    scrollToIndex={selectedOption}
                                    onItemsRendered={this.syncMenuItemWidths}
                                    renderItem={({ index, style }) => {
                                        const op = suggestions[index];
                                        const { label, option } = this.optionTemplate(op);
                                        const styles = option ? withOptionStyle : withoutOptionStyle;
                                        const baseStyle = this.applyOverflowStyles(styles);

                                        return (
                                            <div key={index} style={style}>
                                                <MenuItem
                                                    style={baseStyle}
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
    buildInputProps({ selected, clearable, disabled, multiple, query, InputProps, openSuggestions, isLoading }) {
        const { startAdornment, label = '' } = !multiple ? this.optionTemplate(selected) : {};
        const InputProperties = {
            ...InputProps,
            inputRef: this.inputRef,
            autoComplete: 'off',
            onChange: this.onSearching,
            disableUnderline: true,
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
                    <>
                        <Tooltip title={label}>
                            <StyledChip
                                color="primary"
                                key={index}
                                label={label}
                                tabIndex={-1}
                                onDelete={this.buildRemoveChip(option)}
                                disabled={disabled}
                                {...ChipProps}
                            />
                        </Tooltip>
                    </>
                );
            });
        } else if (!InputProps?.startAdornment || startAdornment) {
            InputProperties.startAdornment = startAdornment && <AdormentStyle>{startAdornment}</AdormentStyle>;
            if (!InputProperties.endAdornment) {
                if (selected && clearable && !disabled) {
                    InputProperties.endAdornment = (
                        <IconButton aria-label="Clear input" onClick={this.clearInput} size="large">
                            <MdiIcon name="close" />
                        </IconButton>
                    );
                }
            }
        } else if (InputProps?.startAdornment) {
            InputProperties.startAdornment = <AdormentIconStyle>{InputProps.startAdornment}</AdormentIconStyle>;
        }

        if (!InputProperties.endAdornment) {
            let adornment = null;
            if ((!selected || !clearable || multiple) && !openSuggestions && !disabled) {
                adornment = <KeyboardArrowDown />;
            }
            if (openSuggestions && !disabled) {
                adornment = <KeyboardArrowUp />;
            }
            if (isLoading) {
                adornment = <CircularProgress size={12} onClick={this.handleClose} />;
            }
            if (adornment) {
                InputProperties.endAdornment = <IconButton onClick={this.onClickArrow} size="large">{adornment}</IconButton>;
            }
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
            className,
            optionsOverflow, // eslint-disable-line no-unused-vars
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
            openSuggestions,
            isLoading,
        });
        const hideInput = multiple ? disabled : disabled && !value;
        return (
            <Fragment>
                <ClickAwayListener onClickAway={this.handleClose}>
                    <StyledTextField
                        autocompleteMultiple={multiple}
                        InputProps={InputProperties}
                        InputLabelProps={{ shrink: true }}
                        onFocus={this.handleOpen}
                        disabled={disabled}
                        autoComplete="off"
                        hideInput={hideInput}
                        className={className}
                        $multiple={multiple}
                        {...restProps}
                    />
                </ClickAwayListener>
                {this.buildSuggestionsPopper(suggestions, openSuggestions, VirtualListProps, PopperProps, selectedOption)}
            </Fragment>
        );
    }
}

export default Autocomplete;
