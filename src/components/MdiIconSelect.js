import React, { PureComponent } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MdiIcon from './MdiIcon';
import Autocomplete from './Autocomplete';
import { iconsList } from '../utils/data/iconsList';
import { bind, memoize } from '../utils/decorators/decoratorUtils';

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
            option: (
                <ListItem ContainerComponent="div" dense disableGutters>
                    <ListItemIcon>
                        <MdiIcon name={value} />
                    </ListItemIcon>
                    <ListItemText primary={label} />
                </ListItem>
            ),
        };
    }

    render() {
        return (
            <Autocomplete
                options={this.buildOptions(iconsList)}
                optionTemplate={this.optionTemplate}
                placeholder="Select an icon"
                {...this.props}
            />
        );
    }
}

export default MdiIconSelect;
