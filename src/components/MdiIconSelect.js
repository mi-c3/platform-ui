import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MdiIcon from 'components/MdiIcon';
import Autocomplete from 'components/Autocomplete';
import { iconsList } from 'utils/data/iconsList';
import { bind, memoize, debounce } from 'utils/decorators/decoratorUtils';
import { arrayfy } from 'utils/utils';
import { get } from 'utils/lo/lo';

// eslint-disable-next-line
const { options, optionTemplate, ...autocompletePropsSubSet } = (Autocomplete || {}).propTypes || {};

class MdiIconSelect extends PureComponent {
    static propTypes = {
        ...autocompletePropsSubSet,
        randomized: PropTypes.bool,
        clearable: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        const options = this.buildOptions(iconsList);
        this.state = { options };
        let option = options[0];
        if (props.randomized) {
            option = options[Math.floor(Math.random() * options?.length || 0)];
        }
        if (!props.value && (!props.clearable || props.randomized)) {
            const { valueField, multiple } = props;
            const optionValue = valueField ? get(option, valueField, null) : option;
            const value = !multiple ? optionValue : [...(arrayfy(props.value) || []), optionValue];
            this.props.onChange({
                target: { value, name: props.name },
            });
        }
    }

    @bind
    @memoize()
    buildOptions(iconsList) {
        return iconsList.map((icon) => ({ value: icon.name, label: icon.name, type: icon.type }));
    }

    @bind
    optionTemplate({ value, label, type }) {
        return {
            startAdornment: <MdiIcon size={19} name={value} type={type} />,
            label,
            option: (
                <ListItem ContainerComponent="div" dense disableGutters>
                    <ListItemIcon>
                        <MdiIcon name={value} type={type} size={23} />
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
        if (query !== this.props.value && query !== this.props.value?.value) {
            this.setState({ options: options.filter((op) => op.label.toLowerCase().includes(query.toLowerCase())) });
        } else {
            this.setState({ options });
        }
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
