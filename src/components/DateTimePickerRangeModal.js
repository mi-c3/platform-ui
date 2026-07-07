import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import styled from 'styled-components';

import { bind } from 'utils/decorators/decoratorUtils';

import DateTimePicker from './DateTimePicker';
import TextField from './TextField';
import MdiIcon from './MdiIcon';

const normilizeDate = (date) => moment(date).format('DD, MMM YYYY HH:mm');

const CancelButton = styled(Button)`
    color: #999999;
    position: absolute;
    left: 12px;
`;

const ClearButton = styled(Button)`
    color: #999999;
`;

class DateTimePickerRangeModal extends PureComponent {
    static propTypes = {
        ...(DateTimePicker || {}).propTypes,
        value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])),
    };

    constructor(props) {
        super(props);
        const [start, end] = (props.value && props.value.map((date) => new Date(date))) || [null, null];
        this.state = { start, end, showModal: false, fieldLabel: 'All days' };
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
        this.setState({ start: null, end: null, fieldLabel: 'All days' }, this.onChange);
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
        this.setState({ start, end });
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
        this.setState({ start, end });
    }

    @bind
    toggleModal() {
        this.setState((state) => ({
            showModal: !state.showModal,
        }));
    }

    @bind
    onSave() {
        const { start, end } = this.state;
        this.setState(
            {
                fieldLabel: start ? `${normilizeDate(start)} - ${normilizeDate(end)}` : 'All days   ',
                showModal: false,
            },
            this.onChange
        );
    }

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
                    maxRows={2}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdiIcon name="calendar-blank" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton aria-label="Clear input" onClick={this.onClear} size="large">
                                    <MdiIcon name="close" />
                                </IconButton>
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
                        <CancelButton onClick={this.toggleModal} variant="text">
                            Cancel
                        </CancelButton>
                        <ClearButton onClick={this.onClear} variant="text">
                            Clear
                        </ClearButton>
                        <Button onClick={this.onSave} variant="text">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

export default DateTimePickerRangeModal;
