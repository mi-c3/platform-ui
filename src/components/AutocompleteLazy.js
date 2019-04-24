import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Autocomplete } from 'index';

/**
 *
 */
class AutocompleteLazy extends PureComponent {
    static propTypes = {
        ...Autocomplete.propTypes,
        fetchData: PropTypes.func.isRequired,
    };

    state = {
        options: [],
    };

    suggest = async (event) => {
        const { value } = event.target;
        const options = await this.props.fetchData(value);
        this.setState({ options });
    };

    render() {
        const { options } = this.state;
        const { fetchData, ...autocompleteProps } = this.props; // eslint-disable-line no-unused-vars
        return <Autocomplete {...autocompleteProps} suggest={this.suggest} options={options} />;
    }
}

export default AutocompleteLazy;
