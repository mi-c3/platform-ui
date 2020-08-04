import React, { PureComponent } from 'react';
import { IconButton, InputAdornment } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/styles';

import MdiIcon from 'components/MdiIcon';
import TextField from 'components/TextField';
import Dropzone from './Upload/Dropzone';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { get } from 'utils/lo/lo';
import { colors } from 'styles/theme';

const useStyles = withStyles(() => ({
    iconRoot: {
        color: colors.darkGray,
    },
}));

class UploadFiles extends PureComponent {
    static propTypes = {
        ...(TextField || {}).propTypes,
    };

    static defaultProps = {
        fullWidth: true,
        margin: 'normal',
    };

    @bind
    onClear() {
        const { onChange, name } = this.props;
        onChange && onChange({ target: { name, value: null } });
    }

    @bind
    @memoize()
    getClearAdornment(disabled) {
        return (
            !disabled && (
                <InputAdornment position="end">
                    <IconButton aria-label="Clear input" onClick={this.onClear}>
                        <Cancel className={this.props.classes.iconRoot} />
                    </IconButton>
                </InputAdornment>
            )
        );
    }

    @bind
    onChange(ev) {
        const {
            target: { value },
        } = ev;
        this.props.onChange({ target: { value: get(value, '[0]', null), name: this.props.name } });
    }

    @bind
    @memoize()
    getUploadAdornment(disabled) {
        return (
            !disabled && (
                <InputAdornment position="end">
                    <Dropzone disableDragActive accept={this.props.accept} showPreviews={false} showAlerts={false} onChange={this.onChange}>
                        <IconButton aria-label="Upload" onClick={this.onUpload}>
                            <MdiIcon name="upload" />
                        </IconButton>
                    </Dropzone>
                </InputAdornment>
            )
        );
    }

    render() {
        const {
            disabled,
            value,
            name, // eslint-disable-line no-unused-vars
            accept, // eslint-disable-line no-unused-vars
            onChange, // eslint-disable-line no-unused-vars
            fileLabel,
            label,
            ...restProps
        } = this.props;
        let valueLabel = value && fileLabel ? get(value, fileLabel) : '';
        valueLabel = value && !valueLabel ? 'File uploaded' : valueLabel;
        return (
            <TextField
                label={label}
                value={valueLabel}
                InputProps={{
                    endAdornment: value ? this.getClearAdornment(disabled) : this.getUploadAdornment(disabled),
                }}
                {...restProps}
            />
        );
    }
}

export default useStyles(UploadFiles); // eslint-disable-line react-hooks/rules-of-hooks
