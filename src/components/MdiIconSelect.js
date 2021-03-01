import React, { PureComponent } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MdiIcon from 'components/MdiIcon';
import Autocomplete from 'components/Autocomplete';
import { iconsList } from 'utils/data/iconsList';
import { bind, memoize, debounce } from 'utils/decorators/decoratorUtils';

// eslint-disable-next-line
const { options, optionTemplate, ...autocompletePropsSubSet } = (Autocomplete || {}).propTypes || {};

class MdiIconSelect extends PureComponent {
    static propTypes = autocompletePropsSubSet;

    constructor(props) {
        super(props);
        this.state = {
            options: this.buildOptions(iconsList),
        };
    }

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
    @debounce()
    suggest(event) {
        const query = event.target.value;
        const options = this.buildOptions(iconsList);
        this.setState({ options: options.filter((op) => op.label.toLowerCase().includes(query.toLowerCase())) });
    }

    render() {
        const { options } = this.state;
        return (
            <Autocomplete
                optionTemplate={this.optionTemplate}
                placeholder="Select an icon"
                {...this.props}
                suggest={this.suggest}
                options={options}
            />
        );
    }
}

export default MdiIconSelect;
