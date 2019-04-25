import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class StatefullInput extends PureComponent {
    static propTypes = {
        value: PropTypes.any,
        onChange: PropTypes.func,
        Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    };

    constructor(props) {
        super(props);
        this.state = { value: props.value };
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if (value !== prevProps.value && value !== this.state.value) {
            this.setState({ value });
        }
    }

    onChange = (event) => {
        const { value } = event.target;
        this.setState({ value });
        this.props.onChange && this.props.onChange(event);
    };

    render() {
        const { Component, ...rest } = this.props;
        return <Component {...rest} value={this.state.value} onChange={this.onChange} />;
    }
}

export default (Component) => (props) => <StatefullInput {...props} Component={Component} />; // eslint-disable-line
