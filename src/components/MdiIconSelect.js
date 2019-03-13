

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

import MdiIcon from 'components/MdiIcon';
import Autocomplete  from 'components/Autocomplete';
import { iconsList } from 'utils/data/iconsList';

class MdiIconSelect extends PureComponent {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        label: PropTypes.string,
        name: PropTypes.string,
        required: PropTypes.bool,
        size: PropTypes.number,
    };

    buildOptions = memoize((iconsList) => iconsList.map(value => ({ value, label: value })));

    optionTemplate = ({ value, label }) => ({
        startAdornment: <MdiIcon size={19} name={value} />,
        label
    });

    render() {
        const { disabled, label, name, required, onChange, value, ...restProps } = this.props;
        return (
            <Autocomplete
                required={required}
                label={label}
                name={name}
                value={value}
                options={this.buildOptions(iconsList)}
                optionTemplate={this.optionTemplate}
                onChange={onChange}
                placeholder="Select an icon"
                disabled={disabled}
                VirtualListProps={{
                    itemSize: 32,
                }}
                {...restProps}
            />
        );

    }
}


export default MdiIconSelect;
