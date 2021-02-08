import React, { PureComponent } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MdiIcon from 'components/MdiIcon';
import AutocompleteLazy from 'components/AutocompleteLazy';
import { iconsList } from 'utils/data/iconsList';
import { bind, memoize } from 'utils/decorators/decoratorUtils';

// eslint-disable-next-line
const { options, optionTemplate, ...autocompletePropsSubSet } = (AutocompleteLazy || {}).propTypes || {};

class MdiIconSelect extends PureComponent {
    static propTypes = autocompletePropsSubSet;

    @bind
    @memoize()
    buildOptions(iconsList) {
        return iconsList.map((icon) => ({ value: icon, label: icon }));
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

    @bind
    async fetchData(value) {
        const options = this.buildOptions(iconsList);
        return options.filter((op) => op.label.toLowerCase().includes(value.toLowerCase()));
    }

    render() {
        return (
            <AutocompleteLazy
                options={this.buildOptions(iconsList)}
                fetchData={this.fetchData}
                optionTemplate={this.optionTemplate}
                placeholder="Select an icon"
                {...this.props}
            />
        );
    }
}

export default MdiIconSelect;
