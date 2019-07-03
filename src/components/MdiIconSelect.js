import React, { PureComponent } from 'react';

import MdiIcon from 'components/MdiIcon';
import Autocomplete from 'components/Autocomplete';
import { iconsList } from 'utils/data/iconsList';
import { bind, memoize } from 'utils/decorators/decoratorUtils';

// eslint-disable-next-line
const { options, optionTemplate, ...autocompletePropsSubSet } = (Autocomplete || {}).propTypes || {};

class MdiIconSelect extends PureComponent {
    static propTypes = autocompletePropsSubSet;

    @bind
    @memoize()
    buildOptions(iconsList) {
        return iconsList.map((value) => ({ value, label: value }));
    }

    @bind
    optionTemplate({ value, label }) {
        return {
            startAdornment: <MdiIcon size={19} name={value} />,
            label,
        };
    }

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
