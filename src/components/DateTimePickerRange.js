import React, { PureComponent, Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Cancel from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';

import DateTimePicker from './DateTimePicker';
import TextField from './TextField';
import MdiIcon from './MdiIcon';
import { bind, memoize } from 'utils/decorators/decoratorUtils';

const styles = {
    inputWrapper: { flexGrow: 1, display: 'flex', flexWrap: 'wrap' },
    customInput: { flexGrow: 1, marginBottom: '-10px' },
};

const CustomInput = withStyles(styles)(({ value, onClick, placeholder, classes }) => (
    <InputBase className={classes.customInput} placeholder={placeholder} value={value} onClick={onClick} />
));

CustomInput.propTypes = {
    value: PropTypes.any,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
};

class CalendarRange extends PureComponent<Object, Object> {
    static propTypes = {
        ...(DateTimePicker || {}).propTypes,
        value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])),
        classes: PropTypes.object.isRequired,
    };

    constructor(props: Object) {
        super(props);
        const [start, end] = (props.value && props.value.map((date) => new Date(date))) || [null, null];
        this.state = { start, end, showModal: false };
    }

    componentDidUpdate(prevProps) {
        const props = this.props;
        const [start, end] = (props.value && props.value.map((date) => new Date(date))) || [null, null];
        if (prevProps.value !== this.props.value) {
            this.setState({ start, end });
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
        const { PickersFromProps, PickersToProps, classes, disabled, ...restProps } = this.props;
        const { start, end } = this.state;
        return (
            <Fragment>
                <TextField
                    multiline
                    rowsMax={2}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdiIcon name="calendar-blank" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="Clear input" onClick={this.onClear}>
                                    <Cancel />
                                </IconButton>
                            </InputAdornment>
                        ),
                        inputComponent: this.buildInputs(PickersToProps, PickersFromProps, start, end, classes, disabled),
                    }}
                    disabled={disabled}
                    {...restProps}
                />
            </Fragment>
        );
    }
}

export default memo(withStyles(styles)(CalendarRange));
