import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { DropzoneDialog, Button } from 'index';

export default class DropzoneDialogWrapper extends PureComponent {

    static propTypes = {
        ...DropzoneDialog.propTypes,
        onChange: PropTypes.func,
    };


    state = {
        open: false,
        files: []
    }

    handleClose = () => {
        this.setState({
            open: false
        });
    }

    handleChange = (files) => {
        this.setState({
            files: files,
        });
        this.props.onChange && this.props.onChange(files);
    }

    handleOpen = () => {
        this.setState({
            open: true,
        });
    }

    render() {
        const { onChange, ...restProps } = this.props; // eslint-disable-line no-unused-vars
        return (
            <Fragment>
                <Button onClick={this.handleOpen}>
                  Open dialog
                </Button>
                <DropzoneDialog
                    open={this.state.open}
                    value={this.state.files}
                    onChange={this.handleChange}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    onClose={this.handleClose}
                    {...restProps}
                />
            </Fragment>
        );
    }
}
