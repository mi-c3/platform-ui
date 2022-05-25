import React, { PureComponent, Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';

import Autocomplete from './Autocomplete';
import Checkbox from './Checkbox';
import DateTimePicker from './DateTimePicker';
import TextField from './TextField';
import MdiIcon from './MdiIcon';
import { bind, memoize } from 'utils/decorators/decoratorUtils';

const styles = {
    inputWrapper: { flexGrow: 1, display: 'flex', flexWrap: 'wrap' },
    customInput: { flexGrow: 1, marginBottom: '-10px' },
    emptySpace: { marginRight: '4px' },
};

const CustomInput = withStyles(styles)(({ value, onClick, placeholder, classes, disabled }) => (
    <InputBase disabled={disabled} className={classes.customInput} placeholder={placeholder} value={value} onClick={onClick} />
));

CustomInput.propTypes = {
    value: PropTypes.any,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
};

const unitOptions = [
    { label: 'Minute(s)', value: 'mins' },
    { label: 'Hour(s)', value: 'hours' },
    { label: 'Minute(s)', value: 'days' },
    { label: 'Month(s)', value: 'month' },
];

const rangeOptions = [
    { label: 'Last', value: 'last' },
    { label: 'Next', value: 'next' },
];

const defaultRelativeValue = { relative: true, range: 'last', amount: 1, unit: 'mins' };

class DateTimePickerRange extends PureComponent {
    static propTypes = {
        ...(DateTimePicker || {}).propTypes,
        value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])),
        classes: PropTypes.object.isRequired,
    };

    static defaultProps = {
        variant: 'standart',
        relative: false,
    };

    constructor(props) {
        super(props);
        const [start, end] = (props.value && props.value.map((date) => new Date(date))) || [null, null];
        this.state = { start, end, showModal: false, relative: !['all', 'standart'].includes(props.variant) };
    }

    componentDidUpdate(prevProps, prevState) {
        const { value, relative, variant, name, onChange } = this.props;
        if (!value || Array.isArray(value)) {
            const [start, end] = (value && value.map((date) => new Date(date))) || [null, null];
            if (prevProps.value !== value) {
                this.setState({ start, end });
            }
        }
        if (prevProps.relative !== relative || prevProps.variant !== variant) {
            this.setState({ relative: relative || !['all', 'standart'].includes(variant) });
        }
        if ((prevProps.relative !== relative || prevState.relative !== this.state.relative) && value) {
            onChange && onChange({ name, value, target: { name, value: null } });
        }
    }

    @bind
    onClear(e) {
        e.stopPropagation();
        this.setState({ start: null, end: null }, this.onChange);
    }

    @bind
    onChange() {
        const { name, onChange } = this.props;
        if (!onChange) {
            return;
        }
        const { start, end } = this.state;
        const value = start && [start, end];
        onChange && onChange({ name, value, target: { name, value } });
    }

    @bind
    onChangeRelative(evnt) {
        const { name, value, onChange } = this.props;
        const { target } = evnt;
        if (!onChange) {
            return;
        }
        const nextValue =
            value && typeof value === 'object'
                ? {
                      ...defaultRelativeValue, // eslint-disable-line indent
                      ...value, // eslint-disable-line indent
                      [target.name]: target.value, // eslint-disable-line indent
                  } // eslint-disable-line indent
                : { ...defaultRelativeValue, [target.name]: target.value };
        onChange && onChange({ name, value, target: { name, value: nextValue } });
    }

    @bind
    onChangeStart({ target: { value } }) {
        let { end } = this.state;
        let start = value && new Date(value);
        if (!start) {
            end = null;
        } else if (!end) {
            end = new Date(start);
            end.setHours(23, 59, 59, 999);
        } else if (start.getTime() >= end.getTime()) {
            start = new Date(end.getTime());
        }
        start && start.setMilliseconds(0);
        this.setState({ start, end }, this.onChange);
    }

    @bind
    onChangeEnd({ target: { value } }) {
        let { start } = this.state;
        let end = value && new Date(value);
        if (end && !this.state.end) {
            end.setHours(23, 59, 59, 999);
        }
        if (!end) {
            start = null;
        } else if (!start) {
            start = new Date(end);
            start.setHours(0, 0, 0, 0);
        } else if (start.getTime() >= end.getTime()) {
            end = new Date(start.getTime());
        }
        end && end.setMilliseconds(999);
        this.setState({ start, end }, this.onChange);
    }

    @bind
    toggleRelative({ target: { value } }) {
        this.setState({ relative: value });
    }

    @bind
    @memoize()
    buildInputs(PickersToProps, PickersFromProps, start, end, classes, disabled) {
        return () => {
            return (
                <span className={classes.inputWrapper}>
                    <DateTimePicker
                        showTodayButton
                        ampm={false}
                        placeholder="From"
                        {...PickersFromProps}
                        value={start}
                        format="DD, MMM YYYY HH:mm"
                        onChange={this.onChangeStart}
                        TextFieldComponent={CustomInput}
                        disabled={disabled}
                    />
                    <DateTimePicker
                        showTodayButton
                        ampm={false}
                        placeholder="To"
                        {...PickersToProps}
                        value={end}
                        format="DD, MMM YYYY HH:mm"
                        onChange={this.onChangeEnd}
                        TextFieldComponent={CustomInput}
                        disabled={disabled}
                    />
                </span>
            );
        };
    }

    render() {
        const { PickersFromProps, PickersToProps, classes, disabled, variant, value, isMobile, ...restProps } = this.props;
        const { start, end, relative } = this.state;
        return (
            <Fragment>
                {variant === 'all' && (
                    <Checkbox disabled={disabled} label="Relative time" onChange={this.toggleRelative} value={relative} />
                )}
                {relative && ['all', 'relative'].includes(variant) && (
                    <Grid container wrap={isMobile ? 'wrap' : 'nowrap'} justify={isMobile ? 'flex-start' : 'space-around'}>
                        <Autocomplete
                            label="Range"
                            disabled={disabled}
                            required={restProps.required}
                            error={restProps.error}
                            helperText={restProps.helperText}
                            name="range"
                            onChange={this.onChangeRelative}
                            options={rangeOptions}
                            valueField="value"
                            value={value ? value.range || null : null}
                            clearable={false}
                        />
                        {!isMobile && <div className={classes.emptySpace} />}
                        <TextField
                            multiline
                            rowsMax={2}
                            disabled={disabled}
                            required={restProps.required}
                            name="amount"
                            label="Amount"
                            onChange={this.onChangeRelative}
                            value={value ? value.amount || null : null}
                        />
                        {!isMobile && <div className={classes.emptySpace} />}
                        <Autocomplete
                            valueField="value"
                            label="Unit"
                            disabled={disabled}
                            required={restProps.required}
                            name="unit"
                            onChange={this.onChangeRelative}
                            options={unitOptions}
                            value={value ? value.unit || null : null}
                            clearable={false}
                        />
                    </Grid>
                )}
                {!relative && ['all', 'standart'].includes(variant) && (
                    <TextField
                        multiline
                        rowsMax={2}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdiIcon name="calendar-blank" />
                                </InputAdornment>
                            ),
                            endAdornment: !disabled && (
                                <InputAdornment position="end">
                                    <IconButton aria-label="Clear input" onClick={this.onClear}>
                                        <MdiIcon name="close" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            inputComponent: this.buildInputs(PickersToProps, PickersFromProps, start, end, classes, disabled),
                        }}
                        disabled={disabled}
                        {...restProps}
                    />
                )}
            </Fragment>
        );
    }
}

export default memo(withStyles(styles)(DateTimePickerRange));
