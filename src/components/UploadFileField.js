import React, { PureComponent } from 'react';
import { IconButton, InputAdornment, Grid, Typography, TextField, FormControl, FormHelperText, InputLabel, Input } from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/styles';

import MdiIcon from './MdiIcon';
import { bind, memoize } from '../utils/decorators/decoratorUtils';
import { get } from '../utils/lo/lo';
import { colors } from '../styles/theme';
import Dropzone from './Upload/Dropzone';

const useStyles = withStyles(() => ({
    fullWidth: {
        width: '100%',
        flexWrap: 'nowrap',
    },
    marginNormal: {
        margin: '1rem 0',
    },
    input: {},
    iconRoot: {
        color: colors.darkGray,
    },
    startAdornment: {
        marginRight: '17px',
    },
    startAdornmentTypography: {
        marginTop: '-4px',
    },
}));

class UploadFileField extends PureComponent {
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
            error,
            helperText,
            classes,
            name, // eslint-disable-line no-unused-vars
            fullWidth,
            accept, // eslint-disable-line no-unused-vars
            onChange, // eslint-disable-line no-unused-vars
            fileLabel,
            label,
            margin,
            ...restProps
        } = this.props;
        let valueLabel = value && fileLabel ? get(value, fileLabel) : '';
        valueLabel = value && !valueLabel ? 'File uploaded' : valueLabel;
        return (
            <Grid
                container
                alignItems="center"
                className={`${fullWidth && classes.fullWidth} ${margin === 'normal' && classes.marginNormal} `}
            >
                <Typography className={classes.startAdornmentTypography}>
                    <MdiIcon name="earth-box" className={fullWidth && classes.startAdornment} />
                </Typography>
                <Grid item className={fullWidth && classes.fullWidth}>
                    <FormControl className={fullWidth && classes.fullWidth}>
                        <InputLabel>{label}</InputLabel>
                        <Input
                            value={valueLabel}
                            id="component-helper"
                            disableUnderline
                            endAdornment={value ? this.getClearAdornment(disabled) : this.getUploadAdornment(disabled)}
                            fullWidth
                            {...restProps}
                        />
                        <FormHelperText error={error}>{helperText}</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        );
    }
}

export default useStyles(UploadFileField); // eslint-disable-line react-hooks/rules-of-hooks
