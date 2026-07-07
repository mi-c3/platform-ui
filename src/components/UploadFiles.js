import React, { PureComponent } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import styled from 'styled-components';

import MdiIcon from 'components/MdiIcon';
import TextField from 'components/TextField';
import Dropzone from './Upload/Dropzone';
import { bind, memoize } from 'utils/decorators/decoratorUtils';
import { get } from 'utils/lo/lo';
import { colors } from 'styles/theme';

const ClearIconStyled = styled(MdiIcon)`
    color: ${colors.darkGray};
`;

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
        const { multiple, name } = this.props;
        this.props.onChange({ target: { value: multiple ? value || [] : get(value, '[0]', null), name } });
    }

    @bind
    @memoize()
    getUploadAdornment(disabled, multiple) {
        return (!disabled && (<InputAdornment position="end">
            <Dropzone
                disableDragActive
                accept={this.props.accept}
                showPreviews={false}
                multiple={multiple}
                filesLimit={multiple ? Infinity : 1}
                onChange={this.onChange}
            >
                <IconButton aria-label="Upload" size="large">
                    <MdiIcon name="upload" />
                </IconButton>
            </Dropzone>
        </InputAdornment>));
    }

    render() {
        const {
            disabled,
            value,
            multiple,
            name, // eslint-disable-line no-unused-vars
            accept, // eslint-disable-line no-unused-vars
            onChange, // eslint-disable-line no-unused-vars
            fileLabel,
            label,
            ...restProps
        } = this.props;
        const hasValue = Array.isArray(value) ? value.length > 0 : !!value;
        let valueLabel = '';
        if (Array.isArray(value)) {
            valueLabel = value.map((file) => (fileLabel && get(file, fileLabel)) || file.name).filter(Boolean).join(', ');
        } else {
            valueLabel = value && fileLabel ? get(value, fileLabel) : '';
            valueLabel = value && !valueLabel ? 'File uploaded' : valueLabel;
        }
        return (
            <TextField
                label={label}
                value={valueLabel}
                InputProps={{
                    endAdornment: hasValue ? this.getClearAdornment(disabled) : this.getUploadAdornment(disabled, multiple),
                }}
                {...restProps}
            />
        );
    }
}

export default UploadFiles;
