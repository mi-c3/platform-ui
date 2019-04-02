import React, { PureComponent } from 'react';
import memoize from 'memoize-one';

import MdiIcon from 'components/MdiIcon';
import Autocomplete  from 'components/Autocomplete';
import { iconsList } from 'utils/data/iconsList';

// eslint-disable-next-line
const { options, optionTemplate, ...autocompletePropsSubSet } = Autocomplete.propTypes || {};

class MdiIconSelect extends PureComponent {

    static propTypes = autocompletePropsSubSet;

    buildOptions = memoize((iconsList) => iconsList.map(value => ({ value, label: value })));

    optionTemplate = ({ value, label }) => ({
        startAdornment: <MdiIcon size={19} name={value} />,
        label
    });

    render() {
        const { VirtualListProps, ...restProps } = this.props;
        return (
            <Autocomplete
                options={this.buildOptions(iconsList)}
                optionTemplate={this.optionTemplate}
                placeholder="Select an icon"
                VirtualListProps={{
                    itemSize: 32,
                    ...VirtualListProps,
                }}
                {...restProps}
            />
        );

    }
}


export default MdiIconSelect;
