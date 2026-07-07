import React, { PureComponent } from 'react';
import { IconButton, InputAdornment, GridLegacy as Grid, Typography, TextField, FormControl, FormHelperText, InputLabel, Input } from '@mui/material';
import styled, { css } from 'styled-components';

import MdiIcon from 'components/MdiIcon';
import Dropzone from './Upload/Dropzone';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { get } from 'utils/lo/lo';
import { colors } from 'styles/theme';

const fullWidthStyle = css`
    width: 100%;
    flex-wrap: nowrap;
`;

const GridContainerStyled = styled(Grid)`
    ${({ $fullWidth }) => ($fullWidth ? fullWidthStyle : '')};
    ${({ $marginNormal }) => ($marginNormal ? 'margin: 1rem 0;' : '')};
`;

const GridItemStyled = styled(Grid)`
    ${({ $fullWidth }) => ($fullWidth ? fullWidthStyle : '')};
`;

const FormControlStyled = styled(FormControl)`
    ${({ $fullWidth }) => ($fullWidth ? fullWidthStyle : '')};
`;

const ClearIconStyled = styled(MdiIcon)`
    color: ${colors.darkGray};
`;

const StartAdornmentIconStyled = styled(MdiIcon)`
    ${({ $fullWidth }) => ($fullWidth ? 'margin-right: 17px;' : '')};
`;

const TypographyStyled = styled(Typography)`
    margin-top: -4px;
`;

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
        return (!disabled && (<InputAdornment position="end">
            <IconButton aria-label="Clear input" onClick={this.onClear} size="large">
                <ClearIconStyled name="close" />
            </IconButton>
        </InputAdornment>));
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
        return (!disabled && (<InputAdornment position="end">
            <Dropzone disableDragActive accept={this.props.accept} showPreviews={false} showAlerts={false} onChange={this.onChange}>
                <IconButton aria-label="Upload" onClick={this.onUpload} size="large">
                    <MdiIcon name="upload" />
                </IconButton>
            </Dropzone>
        </InputAdornment>));
    }

    render() {
        const {
            disabled,
            value,
            error,
            helperText,
            classes, // eslint-disable-line no-unused-vars
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
            <GridContainerStyled
                container
                alignItems="center"
                $fullWidth={fullWidth}
                $marginNormal={margin === 'normal'}
            >
                <TypographyStyled>
                    <StartAdornmentIconStyled name="earth-box" $fullWidth={fullWidth} />
                </TypographyStyled>
                <GridItemStyled item $fullWidth={fullWidth}>
                    <FormControlStyled $fullWidth={fullWidth}>
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
                    </FormControlStyled>
                </GridItemStyled>
            </GridContainerStyled>
        );
    }
}

export default UploadFileField;
