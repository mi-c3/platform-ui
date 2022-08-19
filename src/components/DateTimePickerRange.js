import React, { PureComponent, Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// import MomentUtils from '@date-io/moment';

import { withStyles } from '@material-ui/core/styles';

import Button from './Button';
import ModalDialog from './ModalDialog';
import Autocomplete from './Autocomplete';
import Switch from './Switch';
import DateTimePicker from './DateTimePicker';
import TextField from './TextField';
import MdiIcon from './MdiIcon';
import { bind, memoize } from 'utils/decorators/decoratorUtils';

const styles = {
    inputWrapper: { display: 'flex', flexWrap: 'wrap' },
    customInput: { flexGrow: 1, marginBottom: '-10px' },
    emptySpace: { marginRight: '4px' },
    clearButtonWrapper: { margin: '8px 0px' },
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
    { label: 'Minute(s)', value: 'm' },
    { label: 'Hour(s)', value: 'h' },
    { label: 'Day(s)', value: 'd' },
    { label: 'Month(s)', value: 'M' },
    { label: 'Year(s)', value: 'Y' },
];

const rangeOptions = [
    { label: 'Last', value: 'subtract' },
    { label: 'Next', value: 'add' },
];

const unitMap = {
    m: 'minutes',
    M: 'months',
    d: 'days',
    h: 'hours',
    Y: 'years',
};
const rangeMap = {
    subtract: 'Last',
    add: 'Next',
};

const defaultRelativeValue = (unit = 'm') => ({ relative: true, range: 'subtract', amount: 1, unit });

class DateTimePickerRange extends PureComponent {
    static propTypes = {
        ...(DateTimePicker || {}).propTypes,
        value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])),
        relative: PropTypes.boolean,
        defaultUnit: PropTypes.string,
        classes: PropTypes.object.isRequired,
    };

    static defaultProps = {
        variant: 'standard',
        relative: false,
        TextFieldProps: {},
        defaultUnit: 'm',
    };

    constructor(props) {
        super(props);
        const [start, end] = (Array.isArray(props.value) && props.value.map((date) => new Date(date))) || [null, null];
        this.state = {
            start,
            end,
            value: props.value || null,
            showModal: false,
            errors: false,
            relative:
                props.value && props.value.relative
                    ? true
                    : props.value && Array.isArray(props.value)
                        ? false // eslint-disable-line
                        : !['standard'].includes(props.variant), // eslint-disable-line
        };
    }

    componentDidUpdate(prevProps) {
        const { value, variant } = this.props;
        const { relative: relativeState } = this.state;
        let nextState = null;
        if (!relativeState && ['all', 'standard'].includes(variant) && prevProps.value !== value && (!value || Array.isArray(value))) {
            const [start, end] = (value && value.map((date) => new Date(date))) || [null, null];
            nextState = {
                ...(nextState || {}),
                start,
                end,
                value,
                relative: false,
            };
        }
        if (relativeState && ['all', 'relative'].includes(variant) && prevProps.value !== value && (!value || typeof value === 'object')) {
            nextState = {
                ...(nextState || {}),
                value: value || null,
                relative: true,
                start: null,
                end: null,
            };
        }
        if (prevProps.variant !== variant) {
            nextState = {
                ...(nextState || {}),
                relative: ['standard'].includes(variant) ? false : relativeState,
                value: nextState?.value || null,
                start: null,
                end: null,
            };
        }
        if (nextState) {
            this.setState(nextState);
        }
    }

    @bind
    onClear(e) {
        e.stopPropagation();
        this.setState({ start: null, end: null, value: null }, this.onSave);
    }

    @bind
    onClearRelative() {
        this.setState({ start: null, end: null, value: null });
    }

    @bind
    onSave() {
        const { name, onChange } = this.props;
        if (!onChange) {
            return;
        }
        const { value } = this.state;
        if (value?.relative && !value?.amount) {
            return this.setState({ errors: { amount: 'Amount is required.' } });
        }
        onChange && onChange({ name, value, target: { name, value } });
        this.closeModal();
    }

    @bind
    onChange() {
        const { start, end } = this.state;
        const value = start && [start, end];
        this.setState({ value });
    }

    @bind
    onChangeRelative(evnt) {
        const { defaultUnit } = this.props;
        const { value } = this.state;
        const { target } = evnt;
        const nextState = {
            value:
                value && typeof value === 'object'
                    ? {
                          ...defaultRelativeValue(defaultUnit), // eslint-disable-line indent
                          ...value, // eslint-disable-line indent
                          [target.name]: target.value, // eslint-disable-line indent
                      } // eslint-disable-line indent
                    : { ...defaultRelativeValue(defaultUnit), [target.name]: target.value },
        };
        if (nextState.value.amount < 0) {
            nextState.value.amount = 1;
        }
        if (nextState.value.amount) {
            nextState.errors = null;
        }
        this.setState(nextState);
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
        this.setState({ start, end, value: [start, end] }, this.onChange);
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
        this.setState({ start, end, value: [start, end] }, this.onChange);
    }

    @bind
    toggleRelative({ target: { value: checked } }) {
        const { value } = this.props;
        const nextState = { relative: checked, value: null, start: null, end: null };
        if (checked && value && typeof value === 'object') {
            nextState.value = value;
        }
        if (!checked && value && Array.isArray(value)) {
            const [start, end] = value;
            nextState.value = value;
            nextState.start = start;
            nextState.end = end;
        }
        this.setState(nextState);
    }

    @bind
    openModal() {
        this.setState({ showModal: true });
    }
    @bind
    closeModal() {
        this.setState({ showModal: false });
    }

    @bind
    @memoize()
    buildInputs(restProps, PickersToProps, PickersFromProps, start, end, classes, disabled, isMobile) {
        return (
            // <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid container wrap={isMobile ? 'wrap' : 'nowrap'}>
                <TextField
                    multiline
                    rowsMax={2}
                    label="From"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdiIcon name="calendar-blank" />
                            </InputAdornment>
                        ),
                        inputComponent: () => (
                            <DateTimePicker
                                showTodayButton
                                ampm={false}
                                {...PickersFromProps}
                                value={start}
                                format="DD, MMM YYYY HH:mm"
                                onChange={this.onChangeStart}
                                disabled={disabled}
                                TextFieldComponent={CustomInput}
                            />
                        ),
                    }}
                    disabled={disabled}
                    required
                />
                {!isMobile && <div className={classes.emptySpace} />}
                <TextField
                    multiline
                    rowsMax={2}
                    label="To"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdiIcon name="calendar-blank" />
                            </InputAdornment>
                        ),
                        inputComponent: () => (
                            <DateTimePicker
                                showTodayButton
                                ampm={false}
                                {...PickersToProps}
                                value={end}
                                format="DD, MMM YYYY HH:mm"
                                onChange={this.onChangeEnd}
                                disabled={disabled}
                                TextFieldComponent={CustomInput}
                            />
                        ),
                    }}
                    disabled={disabled}
                    required
                />
            </Grid>
            // </MuiPickersUtilsProvider>
        );
    }

    @bind
    buildInputsRelative(restProps, isMobile, disabled, value, classes, errors) {
        return (
            <Grid container wrap={isMobile ? 'wrap' : 'nowrap'} justify={isMobile ? 'flex-start' : 'space-around'}>
                <Autocomplete
                    error={!!errors?.range}
                    label="Range"
                    disabled={disabled}
                    required
                    name="range"
                    onChange={this.onChangeRelative}
                    options={rangeOptions}
                    valueField="value"
                    value={value ? value.range || null : null}
                    clearable={false}
                />
                {!isMobile && <div className={classes.emptySpace} />}
                <TextField
                    error={!!errors?.amount}
                    helperText={errors?.amount}
                    disabled={disabled}
                    required
                    name="amount"
                    label="Amount"
                    type="number"
                    onChange={this.onChangeRelative}
                    value={value ? value.amount || null : null}
                    clearable={false}
                />
                {!isMobile && <div className={classes.emptySpace} />}
                <Autocomplete
                    error={!!errors?.unit}
                    valueField="value"
                    label="Unit"
                    disabled={disabled}
                    required
                    name="unit"
                    onChange={this.onChangeRelative}
                    options={unitOptions}
                    value={value ? value.unit || null : null}
                    clearable={false}
                />
            </Grid>
        );
    }

    render() {
        const {
            PickersFromProps,
            PickersToProps,
            classes,
            disabled,
            variant,
            isMobile,
            TextFieldProps,
            relative: rrelative, //eslint-disable-line
            ...restProps
        } = this.props;
        const { errors, start, end, relative, showModal, value } = this.state;
        const oval = restProps.value;
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
                        endAdornment: !disabled && (
                            <InputAdornment position="end">
                                <IconButton aria-label="Clear input" onClick={this.onClear}>
                                    <MdiIcon name="close" />
                                </IconButton>
                            </InputAdornment>
                        ),
                        inputComponent: (props) => <CustomInput {...props} />,
                        ...(TextFieldProps?.InputProps || {}),
                    }}
                    {...restProps}
                    {...TextFieldProps}
                    disabled={disabled}
                    onClick={this.openModal}
                    value={
                        oval
                            ? oval.relative
                                ? `${rangeMap[oval.range]} ${oval.amount} ${unitMap[oval.unit]}`
                                : `${moment(oval[0]).format('DD, MMM YYYY HH:mm')} - ${moment(oval[1]).format('DD, MMM YYYY HH:mm')}`
                            : ''
                    }
                />
                {showModal && (
                    <ModalDialog
                        onClose={this.closeModal}
                        title={restProps.label}
                        actions={
                            <>
                                <Button className={classes.cancelButton} onClick={this.closeModal} variant="text">
                                    Cancel
                                </Button>
                                <Button onClick={this.onSave} variant="contained" color="primary">
                                    Save
                                </Button>
                            </>
                        }
                        footer={<Typography variant="caption">* All fields are required</Typography>}
                    >
                        {variant === 'all' && (
                            <Switch disabled={disabled} label="Relative time" onChange={this.toggleRelative} value={relative} />
                        )}
                        {relative && this.buildInputsRelative(restProps, isMobile, disabled, value, classes, errors)}
                        {!relative &&
                            this.buildInputs(restProps, PickersToProps, PickersFromProps, start, end, classes, disabled, isMobile)}
                        <Grid container className={classes.clearButtonWrapper}>
                            <Button
                                startIcon={<MdiIcon name="close" size={16} />}
                                onClick={this.onClearRelative}
                                variant="outlined"
                                color="primary"
                            >
                                Clear
                            </Button>
                        </Grid>
                    </ModalDialog>
                )}
            </Fragment>
        );
    }
}

export default memo(withStyles(styles)(DateTimePickerRange));
