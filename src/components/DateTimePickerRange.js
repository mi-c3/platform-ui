import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';

import DateTimePicker from './DateTimePicker';
import TextField from './TextField';
import MdiIcon from './MdiIcon';

const normilizeDate = (date) => moment(date).format('DD, MMM YYYY HH:mm');

class CalendarRange extends PureComponent<Object, Object> {
    static propTypes = {
        ...DateTimePicker.propTypes,
        value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])),
    };

    constructor(props: Object) {
        super(props);
        const [start, end] = (props.value && props.value.map((date) => new Date(date))) || [null, null];
        this.state = { start, end, showModal: true, fieldLabel: 'All days' };
    }

    componentDidUpdate(prevProps) {
        const props = this.props;
        const [start, end] = (props.value && props.value.map((date) => new Date(date))) || [null, null];
        if (prevProps.value !== this.props.value) {
            this.setState({ start, end });
        }
    }

    onChange = () => {
        const { name, onChange } = this.props;
        if (!onChange) {
            return;
        }
        const { start, end } = this.state;
        const value = start && [start, end];
        onChange && onChange({ name, value, target: { name, value } });
    };

    onChangeStart = ({ target: { value } }) => {
        let { end } = this.state;
        let start = value && new Date(value);
        if (start && !this.state.start) {
            start.setHours(0, 0, 0, 0);
        }
        if (!start) {
            end = null;
        } else if (!end) {
            end = new Date(start);
            end.setHours(23, 59, 59, 999);
        } else if (start.getTime() >= end.getTime()) {
            start = new Date(end.getTime());
        }
        start && start.setMilliseconds(0);
        this.setState({ start, end });
    };

    onChangeEnd = ({ target: { value } }) => {
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
        this.setState({ start, end });
    };

    toggleModal = () => {
        this.setState((state) => ({
            showModal: !state.showModal,
        }));
    };

    onSave = () => {
        const { start, end } = this.state;
        this.setState(
            {
                fieldLabel: `${normilizeDate(start)} - ${normilizeDate(end)}`,
                showModal: false,
            },
            this.onChange
        );
    };

    render() {
        const { TextFieldProps, PickersFromProps, PickersToProps } = this.props;
        const { start, end, showModal, fieldLabel } = this.state;
        return (
            <Fragment>
                <TextField
                    disabled
                    label="Date and Time Range"
                    value={fieldLabel}
                    onClick={this.toggleModal}
                    multiline
                    rowsMax={2}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdiIcon name="calendar-blank" />
                            </InputAdornment>
                        ),
                    }}
                    {...TextFieldProps}
                />
                <Dialog open={showModal} onClose={this.toggleModal}>
                    <DialogTitle>Date time range</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <DateTimePicker
                            showTodayButton
                            ampm={false}
                            label="From"
                            {...PickersFromProps}
                            value={start}
                            onChange={this.onChangeStart}
                        />
                        <DateTimePicker
                            showTodayButton
                            ampm={false}
                            label="To"
                            {...PickersToProps}
                            value={end}
                            onChange={this.onChangeEnd}
                        />
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button onClick={this.toggleModal} style={{ color: '#999999' }} variant="text">
                            Cancel
                        </Button>
                        <Button onClick={this.onSave} variant="text">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

export default CalendarRange;
